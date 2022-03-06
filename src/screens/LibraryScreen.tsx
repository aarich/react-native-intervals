import { StackNavigationProp } from '@react-navigation/stack';
import {
  Divider,
  Icon,
  Layout,
  List,
  ListItem,
  Text,
  TopNavigationAction,
} from '@ui-kitten/components';
import { useCallback, useEffect } from 'react';
import { Alert, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import PotentialAd from '../components/shared/ads/PotentialAd';
import { deleteTimer } from '../redux/actions';
import { useTimers } from '../redux/selectors/TimerSelector';
import { TimersParamList } from '../types';
import { AdUnit } from '../utils/ads';

type Props = {
  navigation: StackNavigationProp<TimersParamList, 'LibraryScreen'>;
};

const LibraryScreen = ({ navigation }: Props) => {
  const timers = useTimers();
  const dispatch = useDispatch();

  useEffect(() => {
    navigation.setOptions({
      title: 'Interval Timers',
      headerRight: () => (
        <TopNavigationAction
          icon={(props) => <Icon {...props} name="plus" />}
          onPress={() =>
            navigation.push('EditScreen', {
              id: undefined,
              serializedFlow: undefined,
            })
          }
        />
      ),
    });
  }, [navigation]);

  const deleteTimerAlert = useCallback(
    (id: string) => {
      const doIt = () => dispatch(deleteTimer(id));
      if (Platform.OS === 'web') {
        if (
          confirm(
            `Do you really want to delete '${timers[id].name}'?\n\nThis action cannot be undone.`
          )
        ) {
          doIt();
        }
        return;
      }
      Alert.alert(
        'Are you sure?',
        `Do you really want to delete '${timers[id].name}'?\n\nThis action cannot be undone.`,
        [
          {
            text: 'Delete',
            style: 'destructive',
            onPress: doIt,
          },
          { text: 'Cancel' },
        ]
      );
    },
    [dispatch, timers]
  );

  return (
    <Layout style={styles.container}>
      <List
        style={{ flex: 1, width: '100%' }}
        ItemSeparatorComponent={Divider}
        data={Object.values(timers).sort((a, b) =>
          parseInt(a.id) < parseInt(b.id) ? -1 : 1
        )}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem
            title={item.name}
            description={item.description}
            onPress={() => navigation.push('ViewScreen', { id: item.id })}
            accessoryRight={(props) => (
              <Pressable
                style={{ flexDirection: 'row' }}
                onPress={() => deleteTimerAlert(item.id)}
              >
                <Icon {...props} name="trash-outline" />
                <Icon {...props} name="chevron-right-outline" />
              </Pressable>
            )}
          />
        )}
        contentContainerStyle={
          Object.keys(timers).length === 0
            ? {
                flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }
            : undefined
        }
        ListEmptyComponent={
          <View
            style={[
              styles.container,
              {
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                width: '80%',
              },
            ]}
          >
            <Text category="h1">Nothing Here</Text>
            <Text category="s1" style={{ textAlign: 'center', paddingTop: 10 }}>
              {
                'Not sure where to start? Try the "More" tab to learn how to create a new flow. Or tap the + icon at the top right to dive in!'
              }
            </Text>
          </View>
        }
      />
      <PotentialAd unit={AdUnit.library} />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default LibraryScreen;
