import { Button, Icon, Text, useTheme } from '@ui-kitten/components';
import { View, useColorScheme } from 'react-native';

import { ActionType } from '../../types';
import React from 'react';
import { getActionInfo } from '../../utils/actions';

type Props = {
  type: ActionType;
  onPress?: () => void;
  size: number;
  disabled?: boolean;
  active?: boolean;
  showLabel?: boolean;
};

const ActionIcon = ({
  type,
  onPress,
  size,
  disabled = false,
  active = false,
  showLabel = true,
}: Props) => {
  const actionInfo = getActionInfo(type);
  const theme = useTheme();
  const scheme = useColorScheme();
  return (
    <View style={{ alignItems: 'center' }}>
      <Button
        status={actionInfo.themeStatus}
        onPress={onPress}
        style={{
          width: size,
          height: size,
          borderWidth: active ? 4 : 0,
          borderColor:
            theme['color-basic-' + (scheme === 'dark' ? '100' : '700')],
        }}
        accessoryLeft={(props) => <Icon {...props} name={actionInfo.icon} />}
        disabled={disabled}
      />
      {showLabel ? (
        <Text category="c1">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Text>
      ) : null}
    </View>
  );
};

export default ActionIcon;
