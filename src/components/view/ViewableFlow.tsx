import { useEffect, useRef } from 'react';
import { StyleProp, ViewStyle, FlatList } from 'react-native';

import { Action } from '../../types';
import ViewableFlowItem from './ViewableFlowItem';

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

  useEffect(() => {
    if (activeNodeIndex && actions.length > activeNodeIndex) {
      listRef.current?.scrollToIndex({
        animated: true,
        index: activeNodeIndex,
      });
    }
  }, [activeNodeIndex, actions]);

  return (
    <FlatList
      ref={listRef}
      style={style}
      data={actions}
      showsVerticalScrollIndicator={false}
      keyExtractor={({ index }) => `${index}-${index === activeNodeIndex}`}
      onScrollToIndexFailed={() =>
        actions.length > 0 &&
        listRef.current?.scrollToIndex({ animated: true, index: 0 })
      }
      renderItem={({ item: action, index }) => (
        <ViewableFlowItem
          action={action}
          isActive={index === activeNodeIndex}
          labelOverride={labelOverrides[index]}
          progress={progress[index]}
        />
      )}
    />
  );
};

export default ViewableFlow;
