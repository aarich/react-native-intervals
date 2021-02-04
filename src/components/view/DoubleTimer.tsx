import { StyleProp, View, ViewStyle } from 'react-native';

import React from 'react';
import { Text } from '@ui-kitten/components';
import { useSetting } from '../../redux/selectors';

type Props = {
  topText: string;
  bottomText: string;
  style: StyleProp<ViewStyle>;
};

const wrapHorizontalCenter = (content: React.ReactElement) => (
  <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
    {content}
  </View>
);

const DoubleTimer = ({ topText, bottomText, style }: Props) => {
  const countUp = useSetting('countUp');
  const showTotalTime = useSetting('showTotalTime');
  return (
    <View style={[style, { flexDirection: 'row', justifyContent: 'center' }]}>
      <View>
        {wrapHorizontalCenter(
          <Text category="h1" style={{ fontSize: 75, textAlign: 'center' }}>
            {topText}
          </Text>
        )}
        {wrapHorizontalCenter(
          <Text category="c1">
            {countUp ? 'Current Step Time' : 'Remaining Step Time'}
          </Text>
        )}
        {showTotalTime ? (
          <>
            {wrapHorizontalCenter(
              <Text category="h5" style={{ paddingTop: 15 }}>
                {bottomText}
              </Text>
            )}
            {wrapHorizontalCenter(
              <Text category="c1">
                {countUp ? 'Total Time' : 'Remaining Total Time'}
              </Text>
            )}
          </>
        ) : null}
      </View>
    </View>
  );
};

export default DoubleTimer;
