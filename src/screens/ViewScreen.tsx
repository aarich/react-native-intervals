import { Alert, Platform, Share, StyleSheet, View } from 'react-native';
import { Button, Icon, Layout, Text } from '@ui-kitten/components';
import React, { useCallback, useEffect, useState } from 'react';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import { getShortenedURL, makeURL, serialize } from '../utils/api';

import { RouteProp } from '@react-navigation/native';
import RunControls from '../components/view/RunControls';
import { StackNavigationProp } from '@react-navigation/stack';
import { TimersParamList } from '../types';
import ViewableFlow from '../components/view/ViewableFlow';
import { useSetting } from '../redux/selectors';
import { useTimer } from '../redux/selectors/TimerSelector';

type Props = {
  navigation: StackNavigationProp<TimersParamList, 'ViewScreen'>;
  route: RouteProp<TimersParamList, 'ViewScreen'>;
};

const ViewScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;
  const timer = useTimer(id);
  const [activeNodeIndex, setActiveNodeIndex] = useState<number>();
  const [labelOverrides, setLabelOverrides] = useState<(string | undefined)[]>(
    []
  );
  const [progress, setProgress] = useState<(number | undefined)[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const showDescription = !useSetting('hideDescription');

  const share = useCallback(() => {
    if (!timer) {
      // shouldn't happen
      return;
    }

    const serialized = serialize(timer);
    const actuallyShareUrl = (urlGetter: (str: string) => Promise<string>) => {
      urlGetter(serialized).then((url) => {
        let content;
        if (Platform.OS === 'ios') {
          content = { url };
        } else {
          content = { message: url, title: 'Flow' };
        }
        Share.share(content);
      });
    };

    Alert.alert(
      'Share Flow',
      "Would you like to generate a short link to this flow? To do that we'll store its contents in our url shortener, and anyone with access to the url will be able to view it.",
      [
        {
          text: 'Share Short Link',
          onPress: () => actuallyShareUrl(getShortenedURL),
        },
        { text: 'Try Full URL', onPress: () => actuallyShareUrl(makeURL) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );

    console.log(encodeURIComponent(serialized));
  }, [timer]);

  useEffect(() => {
    if (isRunning) {
      activateKeepAwake();
    } else {
      deactivateKeepAwake();
    }
    return () => deactivateKeepAwake();
  });

  useEffect(() => {
    if (!timer) {
      Alert.alert('Flow not found');
      navigation.pop();
      return;
    }
    navigation.setOptions({
      headerTitle: timer.name,
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <Button
            style={{ paddingHorizontal: 0 }}
            appearance="ghost"
            status="basic"
            accessoryLeft={(props) => <Icon {...props} name="share-outline" />}
            onPress={share}
          />
          <Button
            style={{ paddingHorizontal: 0 }}
            appearance="ghost"
            status="basic"
            accessoryLeft={(props) => <Icon {...props} name="edit-outline" />}
            onPress={() =>
              navigation.push('EditScreen', { id, serializedFlow: undefined })
            }
          />
        </View>
      ),
    });
  }, [id, navigation, share, timer]);

  return (
    <Layout style={styles.container}>
      {timer ? (
        <View
          style={{
            marginTop: '5%',
            marginHorizontal: '5%',
            flexGrow: 1,
            flex: 1,
          }}
        >
          {timer.description && showDescription ? (
            <Text category="s1" style={{ paddingBottom: 14 }}>
              {timer.description}
            </Text>
          ) : null}
          <View>
            <RunControls
              onRunningStateChange={setIsRunning}
              actions={timer.flow}
              onActiveNodeChange={setActiveNodeIndex}
              onLabelOverridesChange={setLabelOverrides}
              onProgressChange={setProgress}
            />
          </View>
          <ViewableFlow
            style={{ paddingTop: 10 }}
            actions={timer.flow}
            progress={progress}
            activeNodeIndex={activeNodeIndex}
            labelOverrides={labelOverrides}
          />
        </View>
      ) : null}
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ViewScreen;
