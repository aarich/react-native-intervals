import { Text, useTheme } from '@ui-kitten/components';
import React, { useEffect, useRef } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { FlatList } from 'react-native-gesture-handler';
import useColorScheme from '../../hooks/useColorScheme';
import { Action } from '../../types';
import { getActionInfo } from '../../utils/actions';
import ActionIcon from '../shared/ActionIcon';

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
  const listRef = useRef<FlatList<Action>>(null);
  const theme = useTheme();
  const scheme = useColorScheme();

  useEffect(() => {
    if (activeNodeIndex && actions.length > activeNodeIndex) {
      listRef.current?.scrollToIndex({
        animated: true,
        index: activeNodeIndex || 0,
      });
    }
  }, [activeNodeIndex, actions]);

  return (
    <FlatList
      // @ts-ignore
      ref={listRef}
      style={style}
      data={actions}
      keyExtractor={(item) => '' + item.index}
      onScrollToIndexFailed={() =>
        actions.length > 0 &&
        listRef.current?.scrollToIndex({ animated: true, index: 0 })
      }
      renderItem={({ item: action, index }) => (
        <View>
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
                active={activeNodeIndex === index}
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
              <Text category="s2" style={{ paddingRight: 5 }}>
                {labelOverrides[index] ||
                  getActionInfo(action.type).getDetails(action)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              {typeof progress[index] !== 'undefined' ? (
                <AnimatedCircularProgress
                  size={40}
                  width={5}
                  fill={Math.min(100, progress[index] || 0)}
                  tintColor={
                    theme[
                      { dark: 'color-info-200', light: 'color-info-700' }[
                        scheme
                      ]
                    ]
                  }
                  backgroundColor={
                    theme[
                      {
                        dark: 'color-info-transparent-600',
                        light: 'color-info-transparent-300',
                      }[scheme]
                    ]
                  }
                />
              ) : null}
            </View>
          </View>
        </View>
      )}
    />
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
