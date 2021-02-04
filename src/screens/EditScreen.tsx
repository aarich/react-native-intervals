import { Action, ActionType, TimersParamList } from '../types';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Icon, Layout, Text } from '@ui-kitten/components';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  calculateRuntime,
  createNewID,
  deserialize,
  msToViewable,
  validateFlow,
} from '../utils/api';
import { useTimer, useTimers } from '../redux/selectors/TimerSelector';

import ActionSelector from '../components/edit/ActionSelector';
import AddNodeOverlay from '../components/edit/actions/AddNodeOverlay';
import EditableFlow from '../components/edit/EditableFlow';
import EmptyCanvasHelp from '../components/edit/EmptyCanvasHelp';
import Input from '../components/shared/Input';
import { RouteProp } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import { getActionInfo } from '../utils/actions';
import { saveTimer } from '../redux/actions';
import { useAppDispatch } from '../redux/store';

type Props = {
  navigation: StackNavigationProp<TimersParamList, 'EditScreen'>;
  route: RouteProp<TimersParamList, 'EditScreen'>;
};

type TimerPropertiesDraft = {
  name: string;
  description: string;
};

// Adapted from https://ysfaran.github.io/blog/post/0002-use-state-with-promise/
const useStateWithPromise = <T extends unknown>(
  initialState: T
): [T, (state: T) => Promise<T>] => {
  const [state, setState] = useState(initialState);
  const resolverRef = useRef<((state: T) => void) | null>(null);

  useEffect(() => {
    if (resolverRef.current) {
      resolverRef.current(state);
      resolverRef.current = null;
    }
    /**
     * Since a state update could be triggered with the exact same state again,
     * it's not enough to specify state as the only dependency of this useEffect.
     * That's why resolverRef.current is also a dependency, because it will guarantee,
     * that handleSetState was called in previous render
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolverRef.current, state]);

  const handleSetState: (state: T) => Promise<T> = useCallback(
    (stateAction) => {
      setState(stateAction);
      return new Promise((resolve) => {
        resolverRef.current = resolve;
      });
    },
    [setState]
  );

  return [state, handleSetState];
};

const EditScreen = ({ navigation, route }: Props) => {
  const dispatch = useAppDispatch();
  const existingTimers = useTimers();
  const { id, serializedFlow } = route.params;
  const timer = useTimer(id || '');
  const isNew = !timer;
  const [propertiesDraft, setPropertiesDraft] = useState({
    name: timer?.name || '',
    description: timer?.description || '',
  });
  const [addType, setAddType] = useState<ActionType>();
  const [actionToEdit, setActionToEdit] = useState<Action>();
  const [nodes, setNodes] = useState<Action[]>(timer?.flow || []);
  const [activeInsertIndex, setActiveInsertIndex] = useState(nodes.length);
  const [totalRuntime, setTotalRuntime] = useState(() =>
    msToViewable(calculateRuntime(nodes))
  );
  const [dirty, setDirty] = useStateWithPromise(false);

  useEffect(() => {
    if (serializedFlow) {
      const deserialized = deserialize(serializedFlow);
      setPropertiesDraft({
        name: deserialized.name,
        description: deserialized.description || '',
      });
      setNodes(deserialized.flow);
    }
  }, [serializedFlow]);

  const fixIndexes = (nodes: Action[]): Action[] =>
    nodes.map((n, i) => ({ ...n, index: i }));

  const save = useCallback((): Promise<{
    success: boolean;
    timerId?: string;
  }> => {
    try {
      validateFlow(nodes);
    } catch (e) {
      Alert.alert('Error', e.message);
      return Promise.resolve({ success: false });
    }

    const timerId = id || createNewID(existingTimers);
    const { name, description } = propertiesDraft;
    dispatch(
      saveTimer({
        name: name || 'Flow ' + timerId,
        description,
        id: timerId,
        flow: nodes,
      })
    );

    const setTheState: Promise<{
      success: boolean;
      timerId: string;
    }> = new Promise((resolve) => {
      setDirty(false).then(() => resolve({ success: true, timerId }));
    });

    return setTheState;
  }, [id, existingTimers, dispatch, propertiesDraft, nodes, setDirty]);

  const saveNodeForm = useCallback(
    (draft: Record<string, string>) => {
      // One of these will be set
      const type = (addType || actionToEdit?.type) as ActionType;
      let action;
      try {
        action = getActionInfo(type).getAction(draft, activeInsertIndex);
      } catch (e) {
        Alert.alert('Error', e.message);
        return;
      }
      let newNodes = [];

      const index = addType ? activeInsertIndex : activeInsertIndex;

      if (index === nodes.length) {
        // We're adding at the end
        newNodes = [...nodes, action];
      } else {
        let added = false;
        for (let i = 0; i < nodes.length; i++) {
          if (i === index) {
            newNodes.push(action);
            added = true;
            if (addType) {
              // We are inserting a new node, so continue to add the old one that was here
              const updatedNode = { ...nodes[i] };
              updatedNode.index++;
              newNodes.push(updatedNode);
              added = true;
            }
          } else {
            if (added) {
              // need to increment indexes
              const updatedNode = { ...nodes[i] };
              updatedNode.index++;
              newNodes.push(updatedNode);
            } else {
              // we were updating
              newNodes.push(nodes[i]);
            }
          }
        }
      }

      setDirty(true);
      // Update the indexes
      setNodes(fixIndexes(newNodes));
      setAddType(undefined);
      setActionToEdit(undefined);
    },
    [addType, actionToEdit?.type, activeInsertIndex, nodes, setDirty]
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: isNew ? 'Create' : 'Edit',
      headerBackTitle: 'Cancel',
      headerRight: () => (
        <Button
          appearance="ghost"
          status="basic"
          accessoryLeft={(props) => (
            <Icon {...props} name="checkmark-outline" />
          )}
          onPress={() =>
            save().then(({ success, timerId }) => {
              if (success) {
                if (isNew && timerId) {
                  navigation.replace('ViewScreen', { id: timerId });
                } else {
                  navigation.pop();
                }
              }
            })
          }
        />
      ),
    });
  }, [isNew, navigation, save]);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (!dirty) {
          // If we don't have unsaved changes, then we don't need to do anything
          return;
        }
        e.preventDefault();

        Alert.alert(
          'Discard changes?',
          'You may have unsaved changes. This will discard those changes.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Save',
              onPress: () =>
                save().then(({ success }) =>
                  success ? navigation.dispatch(e.data.action) : null
                ),
            },
            {
              text: 'Discard',
              style: 'destructive',
              onPress: () => navigation.dispatch(e.data.action),
            },
          ]
        );
      }),
    [navigation, dirty, save]
  );

  useEffect(() => {
    setActiveInsertIndex(nodes.length);
    if (nodes.length > 0 && nodes[0].type === ActionType.goTo) {
      // Remove go-tos at the beginning
      setNodes(fixIndexes(nodes.filter((_, i) => i !== 0)));
    }
    setTotalRuntime(msToViewable(calculateRuntime(nodes)));
  }, [nodes]);

  const setPropertiesDraftWrapper = (d: TimerPropertiesDraft) => {
    setDirty(true);
    setPropertiesDraft(d);
  };

  return (
    <Layout style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ margin: '5%', flexGrow: 1 }}
        stickyHeaderIndices={[2]}
      >
        <View style={{ flexDirection: 'row' }}>
          <Input
            style={{ flex: 3 }}
            value={propertiesDraft.name}
            placeholder="Flow Name"
            onChangeText={(name) => {
              setPropertiesDraftWrapper({ ...propertiesDraft, name });
            }}
          />
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{ textAlign: 'center' }} category="s1">
              {totalRuntime}
            </Text>
          </View>
        </View>
        <Input
          style={{ paddingVertical: 10 }}
          value={propertiesDraft.description}
          placeholder="Description"
          onChangeText={(description) =>
            setPropertiesDraftWrapper({ ...propertiesDraft, description })
          }
        />
        <ActionSelector
          onInsert={setAddType}
          allowGoTo={
            activeInsertIndex > 0 &&
            nodes[activeInsertIndex - 1]?.type != ActionType.goTo
          }
        />
        <AddNodeOverlay
          typeToCreate={addType}
          actionToEdit={actionToEdit}
          onSave={saveNodeForm}
          onCancel={() => {
            setAddType(undefined);
            setActionToEdit(undefined);
          }}
          existingActions={nodes}
          insertIndex={activeInsertIndex}
        />
        {nodes.length > 0 ? (
          <EditableFlow
            style={{ paddingTop: 10 }}
            actions={nodes}
            onEditNode={(i) => {
              setActiveInsertIndex(i);
              setActionToEdit(nodes[i]);
            }}
            onDeleteNode={(deleteIndex) =>
              setNodes(fixIndexes(nodes.filter((_, i) => deleteIndex !== i)))
            }
            activeInsertIndex={activeInsertIndex}
            onUpdateActiveInsertIndex={(i) =>
              setActiveInsertIndex(i === activeInsertIndex ? nodes.length : i)
            }
          />
        ) : null}

        {nodes.length === 0 ? (
          <EmptyCanvasHelp
            onSetTemplate={(nodes, name, description) => {
              setNodes(nodes);
              setPropertiesDraftWrapper({ name, description });
            }}
          />
        ) : null}
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
  },
});

export default EditScreen;
