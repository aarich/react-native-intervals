import { Icon, Text, useTheme } from '@ui-kitten/components';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Action } from '../../types';
import { getActionInfo } from '../../utils/actions';
import ActionIcon from '../shared/ActionIcon';
import InsertHereButton from './InsertHereButton';

type Props = {
  actions: Action[];
  onEditNode: (index: number) => void;
  onMoveNode: (index: number, isMoveUp: boolean) => void;
  onDeleteNode: (index: number) => void;
  style?: StyleProp<ViewStyle>;
  activeInsertIndex: number;
  onUpdateActiveInsertIndex: (index: number) => void;
};

const EditableFlow = ({
  actions,
  onEditNode,
  onMoveNode,
  onDeleteNode,
  style,
  activeInsertIndex,
  onUpdateActiveInsertIndex,
}: Props) => {
  const primaryColor = useTheme()['color-primary-default'];
  return (
    <View style={style}>
      {actions.map((action, i) => {
        const showUpButton = i > 0;
        const showDownButton = i < actions.length - 1;
        return (
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
              }}>
              <View style={{ paddingRight: 8, flexDirection: 'row' }}>
                <View style={{ justifyContent: 'center', paddingRight: 8 }}>
                  <Text>{i + 1}</Text>
                </View>
                <ActionIcon type={action.type} size={40} showLabel={false} />
              </View>
              <View
                style={{
                  flex: 1,
                  flexGrow: 1,
                  justifyContent: 'center',
                  alignContent: 'center',
                }}>
                <Text category="s1">
                  {getActionInfo(action.type).getDetails(action)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  marginLeft: 14,
                }}>
                {showUpButton && (
                  <Icon
                    style={{ height: 20, width: 20, tintColor: primaryColor }}
                    name="arrowhead-up-outline"
                    onPress={() => onMoveNode(i, true)}
                  />
                )}
                {showDownButton && (
                  <Icon
                    style={{ height: 20, width: 20, tintColor: primaryColor }}
                    name="arrowhead-down-outline"
                    onPress={() => onMoveNode(i, false)}
                  />
                )}
                <Icon
                  name="edit-outline"
                  onPress={() => onEditNode(i)}
                  style={{ height: 20, width: 20, tintColor: primaryColor }}
                />
                <Icon
                  style={{ height: 20, width: 20, tintColor: primaryColor }}
                  name="trash-outline"
                  onPress={() => onDeleteNode(i)}
                />
              </View>
            </View>
            {i === actions.length - 1 ? (
              <View style={{ paddingBottom: 50 }}>
                <InsertHereButton
                  isActive={activeInsertIndex === i + 1}
                  onPress={() => onUpdateActiveInsertIndex(i + 1)}
                />
              </View>
            ) : (
              <></>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default EditableFlow;
