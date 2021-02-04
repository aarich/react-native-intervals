import { Button, Icon, Text } from '@ui-kitten/components';
import { StyleProp, View, ViewStyle } from 'react-native';

import { Action } from '../../types';
import ActionIcon from '../shared/ActionIcon';
import InsertHereButton from './InsertHereButton';
import React from 'react';
import { getActionInfo } from '../../utils/actions';

type Props = {
  actions: Action[];
  onEditNode: (index: number) => void;
  onDeleteNode: (index: number) => void;
  style?: StyleProp<ViewStyle>;
  activeInsertIndex: number;
  onUpdateActiveInsertIndex: (index: number) => void;
};

const EditableFlow = ({
  actions,
  onEditNode,
  onDeleteNode: onDeleteNode,
  style,
  activeInsertIndex,
  onUpdateActiveInsertIndex,
}: Props) => {
  return (
    <View style={style}>
      {actions.map((action, i) => (
        <View key={i}>
          <InsertHereButton
            isActive={activeInsertIndex === i}
            onPress={() => onUpdateActiveInsertIndex(i)}
          />
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
              <View style={{ justifyContent: 'center', paddingRight: 8 }}>
                <Text>{i + 1}</Text>
              </View>
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
                onPress={() => onEditNode(i)}
              />
              <Button
                appearance="ghost"
                accessoryLeft={(props) => (
                  <Icon {...props} name="trash-outline" />
                )}
                onPress={() => onDeleteNode(i)}
              />
            </View>
          </View>
          {i === actions.length - 1 ? (
            <InsertHereButton
              isActive={activeInsertIndex === i + 1}
              onPress={() => onUpdateActiveInsertIndex(i + 1)}
            />
          ) : (
            <></>
          )}
        </View>
      ))}
    </View>
  );
};

export default EditableFlow;
