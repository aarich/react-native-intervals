import { Alert, View } from 'react-native';
import {
  Button,
  Icon,
  Layout,
  StyleService,
  Text,
  useStyleSheet,
} from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';

import { RouteProp } from '@react-navigation/native';
import RunControls from '../components/view/RunControls';
import { StackNavigationProp } from '@react-navigation/stack';
import { TimersParamList } from '../types';
import ViewableFlow from '../components/view/ViewableFlow';
import { share } from '../utils/experience';
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
            onPress={() => share(timer)}
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
