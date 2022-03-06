import { Button, Divider, Icon } from '@ui-kitten/components';

import { View } from 'react-native';

type Props = {
  isActive: boolean;
  onPress: () => void;
  paddingBottom?: number;
};

const InsertHereButton = ({ isActive, onPress, paddingBottom }: Props) => {
  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <View
        style={{
          flex: 1,
          alignContent: 'center',
          justifyContent: 'center',
          marginHorizontal: 20,
          paddingBottom,
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
