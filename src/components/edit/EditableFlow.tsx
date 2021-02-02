import { Button, Divider, Icon, Text } from '@ui-kitten/components';
import { StyleProp, View, ViewStyle } from 'react-native';

import { Action } from '../../types';
import ActionIcon from '../shared/ActionIcon';
import React from 'react';
import { getActionInfo } from '../../utils/actions';

const getInsertHereButton = (
  i: number,
  activeInsertIndex: number,
  setActiveInsertIndex: (i: number) => void
) => (
  <View style={{ flex: 1, flexDirection: 'row' }}>
    <View
      style={{
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
      }}
    >
      <Divider />
    </View>
    <Button
      style={{ flex: 2 }}
      appearance={activeInsertIndex === i ? 'filled' : 'ghost'}
      accessoryLeft={(props) => <Icon {...props} name="plus-circle-outline" />}
      size="small"
      onPress={() => setActiveInsertIndex(i)}
    >
      {activeInsertIndex === i ? 'Inserting Here' : 'Insert Here'}
    </Button>
    <View
      style={{
        flex: 1,
        alignContent: 'center',
        marginHorizontal: 20,
        justifyContent: 'center',
      }}
    >
      <Divider />
    </View>
  </View>
);

type Props = {
  actions: Action[];
  editNode: (index: number) => void;
  deleteNode: (index: number) => void;
  style?: StyleProp<ViewStyle>;
  activeInsertIndex: number;
  setActiveInsertIndex: (index: number) => void;
};

const EditableFlow = ({
  actions,
  editNode,
  deleteNode,
  style,
  activeInsertIndex,
  setActiveInsertIndex,
}: Props) => {
  return (
    <View style={style}>
      {actions.map((action, i) => (
        <View key={i}>
          {getInsertHereButton(i, activeInsertIndex, setActiveInsertIndex)}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignContent: 'center',
              paddingVertical: 10,
            }}
          >
            <View
              style={{
                paddingRight: 15,
                flexDirection: 'row',
              }}
            >
              {/* <View style={{ justifyContent: 'center', paddingRight: 8 }}>
                <Text>{i + 1}</Text>
              </View> */}
              <ActionIcon type={action.type} size={40} />
            </View>
            <View
              style={{
                flex: 1,
                flexGrow: 1,
                justifyContent: 'center',
                alignContent: 'center',
              }}
            >
              <Text category="s1">
                {getActionInfo(action.type).getDetails(action)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
              }}
            >
              <Button
                appearance="ghost"
                accessoryLeft={(props) => (
                  <Icon {...props} name="edit-outline" />
                )}
                onPress={() => editNode(i)}
              />
              <Button
                appearance="ghost"
                accessoryLeft={(props) => (
                  <Icon {...props} name="trash-outline" />
                )}
                onPress={() => deleteNode(i)}
              />
            </View>
          </View>
          {i === actions.length - 1 ? (
            getInsertHereButton(i + 1, activeInsertIndex, setActiveInsertIndex)
          ) : (
            <></>
          )}
        </View>
      ))}
    </View>
  );
};

export default EditableFlow;
