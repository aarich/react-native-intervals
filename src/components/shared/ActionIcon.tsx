import { Alert, Pressable, View } from 'react-native';
import { Button, Icon, Text, useTheme } from '@ui-kitten/components';

import { ActionType } from '../../types';
import React from 'react';
import { getActionInfo } from '../../utils/actions';
import useColorScheme from '../../hooks/useColorScheme';

type Props = {
  type: ActionType;
  onPress?: () => void;
  size: number;
  iconSize?: number;
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
  iconSize,
}: Props) => {
  const actionInfo = getActionInfo(type);
  const theme = useTheme();
  const scheme = useColorScheme();

  const iconSizeProps = iconSize ? { width: iconSize, height: iconSize } : {};
  return (
    <View style={{ alignItems: 'center' }}>
      <Pressable onPress={disabled ? () => Alert.alert('bad') : undefined}>
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
          accessoryLeft={(props) => (
            <Icon {...props} name={actionInfo.icon} {...iconSizeProps} />
          )}
          disabled={disabled}
        />
      </Pressable>
      {showLabel ? <Text category="c1">{actionInfo.label}</Text> : null}
    </View>
  );
};

export default ActionIcon;
