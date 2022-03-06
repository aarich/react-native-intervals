import { Card, Text, useTheme } from '@ui-kitten/components';
import { View } from 'react-native';
import useColorScheme from '../../hooks/useColorScheme';
import { ActionType } from '../../types';
import { getActionTypes } from '../../utils/actions';
import ActionIcon from '../shared/ActionIcon';

export enum InstructionType {
  FirstStep,
  Tutorial,
  Normal,
}

type Props = {
  onInsert: (actionType: ActionType) => void;
  allowGoTo: boolean;
  instruction: InstructionType;
};

const ActionSelector = ({ onInsert, allowGoTo, instruction }: Props) => {
  const actions = getActionTypes();
  const theme = useTheme();
  const scheme = useColorScheme();
  const basicColor = `color-basic-${scheme === 'dark' ? '700' : '300'}`;
  const instructionMsg = {
    [InstructionType.FirstStep]: 'Choose a step to begin the flow',
    [InstructionType.Normal]: 'Choose a step to add at the selected location',
    [InstructionType.Tutorial]:
      'These steps are the building blocks of your flow',
  }[instruction];
  return (
    <Card
      style={{ backgroundColor: theme[basicColor] }}
      status="info"
      header={(props) => (
        <View {...props}>
          <Text category="h6">Add a Step</Text>
          <Text category="s1" style={{ paddingTop: 4 }}>
            {instructionMsg}
          </Text>
        </View>
      )}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}
      >
        {actions.map((action, i) => (
          <View
            key={i}
            style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}
          >
            <ActionIcon
              onPress={() => onInsert(action)}
              type={action}
              size={50}
              disabledMsg={
                action === ActionType.goTo && !allowGoTo
                  ? "You can't add this step at this location."
                  : undefined
              }
            />
          </View>
        ))}
      </View>
    </Card>
  );
};

export default ActionSelector;
