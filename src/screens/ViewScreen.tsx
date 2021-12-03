import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Icon,
  Layout,
  StyleService,
  Text,
  TopNavigationAction,
  useStyleSheet,
} from '@ui-kitten/components';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import React, { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import RunControls from '../components/view/RunControls';
import ViewableFlow from '../components/view/ViewableFlow';
import { useSetting } from '../redux/selectors';
import { useTimer } from '../redux/selectors/TimerSelector';
import { TimersParamList } from '../types';
import { openInApp, osAlert, share } from '../utils/experience';

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
  const styles = useStyleSheet(stylesheet);
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
      osAlert('Flow not found');
      navigation.pop();
      return;
    }
    navigation.setOptions({
      title: timer.name,
      headerTitle: timer.name,
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TopNavigationAction
            icon={(props) => <Icon {...props} name="share-outline" />}
            onPress={() => share(timer)}
          />
          <TopNavigationAction
            icon={(props) => <Icon {...props} name="edit-outline" />}
            onPress={() =>
              navigation.push('EditScreen', { id, serializedFlow: undefined })
            }
          />
          {Platform.OS === 'web' ? (
            <TopNavigationAction
              icon={(props) => <Icon {...props} name="external-link-outline" />}
              onPress={() => openInApp(timer)}
            />
          ) : null}
        </View>
      ),
    });
  }, [id, navigation, timer]);

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
          <View style={styles.listHeader}>
            {timer.description && showDescription ? (
              <Text category="s1" style={styles.description}>
                {timer.description}
              </Text>
            ) : null}

            <RunControls
              onRunningStateChange={setIsRunning}
              actions={timer.flow}
              onActiveNodeChange={setActiveNodeIndex}
              onLabelOverridesChange={setLabelOverrides}
              onProgressChange={setProgress}
            />
          </View>
          <ViewableFlow
            style={{ flex: 1 }}
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

const stylesheet = StyleService.create({
  container: {
    flex: 1,
  },
  description: {
    paddingBottom: 14,
  },
  listHeader: {
    backgroundColor: 'background-basic-color-1',
  },
});

export default ViewScreen;
