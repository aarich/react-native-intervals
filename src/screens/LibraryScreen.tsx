import {
  Button,
  Divider,
  Icon,
  Layout,
  List,
  ListItem,
} from '@ui-kitten/components';
import React, { useEffect } from 'react';

import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import { TimersParamList } from '../types';
import { useTimers } from '../redux/selectors/TimerSelector';

type Props = {
  navigation: StackNavigationProp<TimersParamList, 'LibraryScreen'>;
};

const LibraryScreen = ({ navigation }: Props) => {
  const timers = useTimers();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          appearance="ghost"
          status="basic"
          accessoryLeft={(props) => <Icon {...props} name="plus" />}
          onPress={() => navigation.push('EditScreen', {})}
        />
      ),
    });
  }, [navigation]);

  return (
    <Layout style={styles.container}>
      <List
        style={{ flex: 1, width: '100%' }}
        ItemSeparatorComponent={Divider}
        data={Object.values(timers)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem
            title={item.name}
            description={item.description}
            onPress={() => navigation.push('ViewScreen', { id: item.id })}
            accessoryRight={(props) => (
              <Icon {...props} name="chevron-right-outline" />
            )}
          />
        )}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: { width: 20, height: 20 },
});

export default LibraryScreen;
