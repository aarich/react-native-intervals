import { Button, Icon, Text, useTheme } from '@ui-kitten/components';
import React from 'react';
import { Pressable, View } from 'react-native';
import useColorScheme from '../../hooks/useColorScheme';
import { ActionType } from '../../types';
import { getActionInfo } from '../../utils/actions';
import { osAlert } from '../../utils/experience';

type Props = {
  type: ActionType;
  onPress?: () => void;
  size: number;
  iconSize?: number;
  disabledMsg?: string;
  active?: boolean;
  showLabel?: boolean;
};

const ActionIcon = ({
  type,
  onPress,
  size,
  disabledMsg,
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
      <Pressable onPress={disabledMsg ? () => osAlert(disabledMsg) : undefined}>
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
          disabled={!!disabledMsg}
        />
      </Pressable>
      {showLabel ? <Text category="c1">{actionInfo.label}</Text> : null}
    </View>
  );
};

export default ActionIcon;
