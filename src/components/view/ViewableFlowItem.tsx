import { Text, useTheme } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import useColorScheme from '../../hooks/useColorScheme';
import { Action } from '../../types';
import { getActionInfo } from '../../utils/actions';
import ActionIcon from '../shared/ActionIcon';

type Props = {
  action: Action;
  isActive: boolean;
  labelOverride: string | undefined;
  progress: number | undefined;
};

const ViewableFlowItem = ({
  action,
  isActive,
  labelOverride,
  progress,
}: Props) => {
  const theme = useTheme();
  const scheme = useColorScheme();
  const progressTintColor =
    theme[{ dark: 'color-info-200', light: 'color-info-700' }[scheme]];
  const progressBackgroundColor =
    theme[
      {
        dark: 'color-info-transparent-600',
        light: 'color-info-transparent-300',
      }[scheme]
    ];

  let label = labelOverride;
  let subtitle: string | undefined = undefined;
  if (!label) {
    const actionInfo = getActionInfo(action.type);
    label = actionInfo.getDetails(action);
    if (isActive) {
      const activeDetails = actionInfo.getActiveDetails(action);
      if (activeDetails) {
        label = activeDetails.title;
        subtitle = activeDetails.subtitle;
      }
    }
  }
  return (
    <View>
      <View style={styles.nodeRow}>
        <View style={styles.actionIcon}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActionIcon
              type={action.type}
              size={40}
              active={isActive}
              showLabel={false}
            />
          </View>
        </View>
        <View style={styles.text}>
          <Text category={isActive ? 'h4' : 's2'} style={{ paddingRight: 5 }}>
            {label}
          </Text>
          {subtitle ? (
            <Text category="s2" style={{ paddingRight: 5 }}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <View style={{ flex: 1 }}>
          {typeof progress !== 'undefined' ? (
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <AnimatedCircularProgress
                size={40}
                width={5}
                fill={Math.min(100, progress || 0)}
                tintColor={progressTintColor}
                backgroundColor={progressBackgroundColor}
              />
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actionIcon: {
    flex: 1,
    paddingRight: 15,
    flexDirection: 'row',
  },
  nodeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingVertical: 10,
  },
  text: {
    flex: 4,
    flexGrow: 4,
    justifyContent: 'center',
    alignContent: 'center',
  },
});

export default ViewableFlowItem;
