import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { Action } from '../../types';
import ActionIcon from '../shared/ActionIcon';
import ProgressBar from '../shared/ProgressBar';
import React from 'react';
import { Text } from '@ui-kitten/components';
import { getActionInfo } from '../../utils/actions';

type Props = {
  actions: Action[];
  style?: StyleProp<ViewStyle>;
  activeNodeIndex?: number;
  labelOverrides: (string | undefined)[];
  progress: (number | undefined)[];
};

const ViewableFlow = ({
  actions,
  style,
  activeNodeIndex,
  labelOverrides,
  progress,
}: Props) => {
  return (
    <View style={style}>
      {actions.map((action, i) => (
        <View key={i}>
          <View style={styles.nodeRow}>
            <View
              style={{
                flex: 1,
                paddingRight: 15,
                flexDirection: 'row',
              }}
            >
              <ActionIcon
                type={action.type}
                size={40}
                active={activeNodeIndex === i}
                showLabel={false}
              />
            </View>
            <View
              style={{
                flex: 4,
                flexGrow: 4,
                justifyContent: 'center',
                alignContent: 'center',
              }}
            >
              <Text category="s2">
                {labelOverrides[i] ||
                  getActionInfo(action.type).getDetails(action)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              {typeof progress[i] !== 'undefined' ? (
                <ProgressBar progress={progress[i] as number} />
              ) : null}
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  nodeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingVertical: 10,
  },
});

export default ViewableFlow;
