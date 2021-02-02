import { Action, ActionType, TimersParamList } from '../types';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Icon, Input, Layout } from '@ui-kitten/components';
import React, { useCallback, useEffect, useState } from 'react';
import { useTimer, useTimers } from '../redux/selectors/TimerSelector';

import ActionSelector from '../components/edit/ActionSelector';
import AddNodeOverlay from '../components/edit/AddNodeOverlay';
import EditableFlow from '../components/edit/EditableFlow';
import { RouteProp } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import { createNewID } from '../utils/api';
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

const EditScreen = ({ navigation, route }: Props) => {
  const dispatch = useAppDispatch();
  const existingTimers = useTimers();
  const { id } = route.params;
  const timer = useTimer(id || '');
  const isNew = !timer;
  const [propertiesDraft, setPropertiesDraft] = useState<TimerPropertiesDraft>({
    name: timer?.name || '',
    description: timer?.description || '',
  });
  const [addType, setAddType] = useState<ActionType>();
  const [actionToEdit, setActionToEdit] = useState<Action>();
  const [nodes, setNodes] = useState<Action[]>(
    timer?.flow || [
      { type: ActionType.wait, params: { time: 2 }, index: 0 },
      {
        type: ActionType.act,
        params: { time: 3, name: 'TestTestTest mestTestTest' },
        index: 1,
      },
      {
        type: ActionType.goTo,
        params: { times: 2, targetNode: 1 },
        index: 2,
      },
    ]
  );
  const [activeInsertIndex, setActiveInsertIndex] = useState<number>(
    nodes.length
  );

  const fixIndexes = (nodes: Action[]): Action[] =>
    nodes.map((n, i) => ({ ...n, index: i }));

  const save = useCallback(() => {
    const timerId = id || createNewID(existingTimers);
    const { name, description } = propertiesDraft;
    dispatch(
      saveTimer({
        name: name || 'Timer ' + timerId,
        description,
        id: timerId,
        flow: nodes,
      })
    );

    if (isNew) {
      navigation.replace('ViewScreen', { id: timerId });
    } else {
      navigation.pop();
    }
  }, [id, existingTimers, dispatch, propertiesDraft, nodes, isNew, navigation]);

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

      // Update the indexes
      setNodes(fixIndexes(newNodes));
      setAddType(undefined);
      setActionToEdit(undefined);
      console.log(propertiesDraft);
    },
    [addType, actionToEdit?.type, activeInsertIndex, nodes, propertiesDraft]
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
          onPress={() => save()}
        />
      ),
    });
  }, [isNew, navigation, save]);

  useEffect(() => {
    setActiveInsertIndex(nodes.length);
    if (nodes.length > 0 && nodes[0].type === ActionType.goTo) {
      // Remove go-tos at the beginning
      setNodes(fixIndexes(nodes.filter((_, i) => i !== 0)));
    }
  }, [nodes]);

  return (
    <Layout style={styles.container}>
      <ScrollView>
        <View style={{ margin: '5%' }}>
          <Input
            value={propertiesDraft.name}
            placeholder="Name"
            onChangeText={(name) =>
              setPropertiesDraft({ ...propertiesDraft, name })
            }
          />
          <Input
            style={{ paddingVertical: 10 }}
            value={propertiesDraft.description}
            placeholder="Description"
            onChangeText={(description) =>
              setPropertiesDraft({ ...propertiesDraft, description })
            }
          />
          <ActionSelector
            onInsert={setAddType}
            allowGoTo={activeInsertIndex > 0}
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
          <EditableFlow
            style={{ paddingTop: 10 }}
            actions={nodes}
            editNode={(i) => {
              setActiveInsertIndex(i);
              setActionToEdit(nodes[i]);
            }}
            deleteNode={(deleteIndex) =>
              setNodes(fixIndexes(nodes.filter((_, i) => deleteIndex !== i)))
            }
            activeInsertIndex={activeInsertIndex}
            setActiveInsertIndex={(i) =>
              setActiveInsertIndex(i === activeInsertIndex ? nodes.length : i)
            }
          />
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

export default EditScreen;
