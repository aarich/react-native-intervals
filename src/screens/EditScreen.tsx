import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import * as Sentry from '@sentry/react-native';

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Icon,
  Input,
  Layout,
  Text,
  TopNavigationAction,
} from '@ui-kitten/components';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';

import AddNodeOverlay from '../components/edit/actions/AddNodeOverlay';
import ActionSelector, {
  InstructionType,
} from '../components/edit/ActionSelector';
import EditableFlow from '../components/edit/EditableFlow';
import EmptyCanvasHelp from '../components/edit/EmptyCanvasHelp';
import useColorScheme from '../hooks/useColorScheme';
import { useStateWithPromise } from '../hooks/useStateWithPromise';
import { saveTimer } from '../redux/actions';
import { TimersState } from '../redux/reducers/timersReducer';
import { useTimer, useTimers } from '../redux/selectors/TimerSelector';
import { Action, ActionType, TimersParamList } from '../types';
import { getActionInfo } from '../utils/actions';
import {
  calculateRuntime,
  createNewID,
  deserialize,
  fixIndexes,
  msToViewable,
  validateFlow,
} from '../utils/api';
import { osAlert } from '../utils/experience';

type Props = {
  navigation: StackNavigationProp<TimersParamList, 'EditScreen'>;
  route: RouteProp<TimersParamList, 'EditScreen'>;
};

type TimerPropertiesDraft = {
  name: string;
  description: string;
};

const save = (
  id: string | undefined,
  existingTimers: TimersState,
  dispatch: Dispatch,
  propertiesDraft: { name: string; description: string },
  nodes: Action[],
  setDirty: (b: boolean) => Promise<boolean>
): Promise<{
  success: boolean;
  timerId?: string;
}> => {
  try {
    validateFlow(nodes);
  } catch (e) {
    osAlert('Error', e instanceof Error ? e.message : '');
    return Promise.resolve({ success: false });
  }

  const timerId = id || createNewID(existingTimers);
  const { name, description } = propertiesDraft;
  dispatch(
    saveTimer({
      name: name || `Flow ${timerId}`,
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
};

const EditScreen = ({ navigation, route }: Props) => {
  const dispatch = useDispatch();
  const scheme = useColorScheme();
  const existingTimers = useTimers();
  const { id, serializedFlow } = route.params || {};
  const timer = useTimer(id || '');
  const isNew = !timer;

  // State
  const [dirty, setDirty] = useStateWithPromise(false);
  const [addType, setAddType] = useState<ActionType>();
  const [actionToEdit, setActionToEdit] = useState<Action>();
  const [nodes, setNodes] = useState<Action[]>(timer?.flow || []);
  const [activeInsertIndex, setActiveInsertIndex] = useState(nodes.length);
  const [totalRuntime, setTotalRuntime] = useState(() =>
    msToViewable(calculateRuntime(nodes))
  );
  const [propertiesDraft, setPropertiesDraft] = useState({
    name: timer?.name || '',
    description: timer?.description || '',
  });

  const saveNodeForm = useCallback(
    (draft: Record<string, string>) => {
      // One of these will be set
      const type = (addType || actionToEdit?.type) as ActionType;
      let action;
      try {
        action = getActionInfo(type).getAction(draft, activeInsertIndex);
      } catch (e) {
        osAlert('Error', e instanceof Error ? e.message : '');
        return;
      }
      let newNodes = [];

      if (activeInsertIndex === nodes.length) {
        // We're adding at the end
        newNodes = [...nodes, action];
      } else {
        let added = false;
        for (let i = 0; i < nodes.length; i++) {
          if (i === activeInsertIndex) {
            newNodes.push(action);
            added = true;
            if (addType) {
              // We are inserting a new node, so continue to add the old one that was here
              const updatedNode = { ...nodes[i] };
              updatedNode.index++;
              newNodes.push(updatedNode);
            }
          } else {
            if (added) {
              // need to increment indexes
              const updatedNode = { ...nodes[i] };
              updatedNode.index++;
              if (updatedNode.type === ActionType.goTo) {
                updatedNode.params.targetNode++;
              }
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

  const deleteNode = useCallback(
    (index: number) => {
      setNodes(
        fixIndexes(nodes.filter((_, i) => index !== i)).map((node) => {
          if (node.type === ActionType.goTo && node.params.targetNode > index) {
            // We deleted a node. If this go to action was intended to go after it, we need to decrement it
            node.params.targetNode--;
          }
          return node;
        })
      );
    },
    [nodes]
  );

  const onSave = useCallback(
    () => save(id, existingTimers, dispatch, propertiesDraft, nodes, setDirty),
    [dispatch, existingTimers, id, nodes, propertiesDraft, setDirty]
  );

  // We may have been routed to with a flow parameter. Load it
  useEffect(() => {
    if (serializedFlow) {
      try {
        const deserialized = deserialize(serializedFlow);

        const properties = {
          name: deserialized.name,
          description: deserialized.description || '',
        };

        setPropertiesDraft(properties);

        setNodes(deserialized.flow);

        save(
          undefined,
          existingTimers,
          dispatch,
          properties,
          deserialized.flow,
          setDirty
        ).then(({ success, timerId }) => {
          if (success && timerId) {
            navigation.replace('ViewScreen', { id: timerId });
          } else {
            osAlert(
              'Something went wrong loading this timer. Please try again later.'
            );
            navigation.pop();
          }
        });
      } catch (e) {
        osAlert("We couldn't load your flow. Please try again later");
        Sentry.captureException(e, { extra: { serializedFlow } });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set the header options
  useEffect(() => {
    navigation.setOptions({
      title: isNew ? 'Create' : 'Edit',
      headerTitle: isNew ? 'Create' : 'Edit',
      headerBackTitle: 'Cancel',
      headerRight: () => (
        <TopNavigationAction
          icon={(props) => <Icon {...props} name="checkmark-outline" />}
          onPress={() =>
            onSave().then(({ success, timerId }) => {
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
  }, [isNew, navigation, onSave]);

  // Guard against losing unsaved changes
  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (!dirty) {
          return;
        }
        e.preventDefault();

        if (Platform.OS === 'web') {
          if (confirm('Are you sure? You will lose any changes')) {
            navigation.dispatch(e.data.action);
          }
        } else {
          Alert.alert(
            'Discard changes?',
            'You may have unsaved changes. This will discard those changes.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Save',
                onPress: () =>
                  onSave().then(({ success }) =>
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
        }
      }),
    [navigation, dirty, onSave]
  );

  // If the nodes are changed do some cleanup work like removing go-tos
  useEffect(() => {
    setActiveInsertIndex(nodes.length);
    if (nodes.length > 0 && nodes[0].type === ActionType.goTo) {
      // Remove go-tos at the beginning
      deleteNode(0);
    }
    setTotalRuntime(msToViewable(calculateRuntime(nodes)));
  }, [nodes, deleteNode]);

  const setPropertiesDraftWrapper = (d: TimerPropertiesDraft) => {
    setDirty(true);
    setPropertiesDraft(d);
  };

  return (
    <Layout style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ margin: '5%', flexGrow: 1 }}
          stickyHeaderIndices={[2]}
        >
          <View>
            <View style={{ flexDirection: 'row' }}>
              <Input
                style={{ flex: 4 }}
                value={propertiesDraft.name}
                placeholder="Flow Name"
                onChangeText={(name) => {
                  setPropertiesDraftWrapper({ ...propertiesDraft, name });
                }}
                keyboardAppearance={scheme}
              />
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ textAlign: 'center' }} category="s1">
                  {totalRuntime}
                </Text>
              </View>
            </View>
          </View>
          <Input
            style={{ paddingVertical: 10 }}
            value={propertiesDraft.description}
            placeholder="Description"
            onChangeText={(description) =>
              setPropertiesDraftWrapper({ ...propertiesDraft, description })
            }
            keyboardAppearance={scheme}
          />
          <ActionSelector
            onInsert={setAddType}
            allowGoTo={
              activeInsertIndex > 0 &&
              nodes[activeInsertIndex - 1]?.type != ActionType.goTo
            }
            instruction={
              nodes.length === 0
                ? InstructionType.FirstStep
                : InstructionType.Normal
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
              onDeleteNode={deleteNode}
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
      </KeyboardAvoidingView>
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
