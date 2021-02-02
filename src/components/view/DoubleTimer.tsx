import { StyleProp, View, ViewStyle } from 'react-native';

import React from 'react';
import { Text } from '@ui-kitten/components';

type Props = {
  topText: string;
  bottomText: string;
  style: StyleProp<ViewStyle>;
};

const wrapHorizontalCenter = (content: React.ReactElement) => (
  <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
    {content}
  </View>
);

const DoubleTimer = ({ topText, bottomText, style }: Props) => {
  return (
    <View
      style={[
        style,
        { flex: 1, flexDirection: 'row', justifyContent: 'center' },
      ]}
    >
      <View>
        {wrapHorizontalCenter(
          <Text category="h1" style={{ fontSize: 75 }}>
            {topText}
          </Text>
        )}
        {wrapHorizontalCenter(
          <Text category="c1" style={{ paddingBottom: 20 }}>
            Current Step Time
          </Text>
        )}
        {wrapHorizontalCenter(<Text category="h5">{bottomText}</Text>)}
        {wrapHorizontalCenter(<Text category="c1">Total Time</Text>)}
      </View>
    </View>
  );
};

export default DoubleTimer;
