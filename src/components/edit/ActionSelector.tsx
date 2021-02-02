import { Card, Text, useTheme } from '@ui-kitten/components';

import ActionIcon from '../shared/ActionIcon';
import { ActionType } from '../../types';
import React from 'react';
import { View } from 'react-native';
import { getActionTypes } from '../../utils/actions';
import useColorScheme from '../../hooks/useColorScheme';

type Props = {
  onInsert: (actionType: ActionType) => void;
  allowGoTo: boolean;
};

const ActionSelector = ({ onInsert, allowGoTo }: Props) => {
  const actions = getActionTypes();
  const theme = useTheme();
  const scheme = useColorScheme();
  const basicColor = 'color-basic-' + (scheme === 'dark' ? '700' : '300');
  return (
    <Card
      style={{ flex: 1, backgroundColor: theme[basicColor] }}
      status="info"
      header={(props) => (
        <View {...props}>
          <Text category="h6">Add a Step</Text>
          <Text category="s1">
            Choose a step to add at the selected location
          </Text>
        </View>
      )}
    >
      <View
        style={{
          flex: 1,
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
              disabled={action === ActionType.goTo && !allowGoTo}
            />
          </View>
        ))}
      </View>
    </Card>
  );
};

export default ActionSelector;
