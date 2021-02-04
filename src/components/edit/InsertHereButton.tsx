import { Button, Divider, Icon } from '@ui-kitten/components';

import React from 'react';
import { View } from 'react-native';

type Props = {
  isActive: boolean;
  onPress: () => void;
};

const InsertHereButton = ({ isActive, onPress }: Props) => {
  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <View
        style={{
          flex: 1,
          alignContent: 'center',
          justifyContent: 'center',
          marginHorizontal: 20,
        }}
      >
        <Divider />
      </View>
      <Button
        style={{ flex: 2 }}
        appearance={isActive ? 'filled' : 'ghost'}
        accessoryLeft={(props) => (
          <Icon {...props} name="plus-circle-outline" />
        )}
        size="small"
        onPress={onPress}
      >
        {isActive ? 'Inserting Here' : 'Insert Here'}
      </Button>
      <View
        style={{
          flex: 1,
          alignContent: 'center',
          marginHorizontal: 20,
          justifyContent: 'center',
        }}
      >
        <Divider />
      </View>
    </View>
  );
};

export default InsertHereButton;
