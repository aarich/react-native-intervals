import { Alert, StyleSheet, View } from 'react-native';
import { Button, Icon, Layout, Text } from '@ui-kitten/components';
import React, { useCallback, useEffect, useState } from 'react';

import { RouteProp } from '@react-navigation/native';
import RunControls from '../components/view/RunControls';
import { ScrollView } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import { TimersParamList } from '../types';
import ViewableFlow from '../components/view/ViewableFlow';
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

  const share = useCallback(() => {
    Alert.alert('Share', timer?.name);
  }, [timer?.name]);

  useEffect(() => {
    if (!timer) {
      Alert.alert('Timer not found');
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
            onPress={() => share()}
          />
          <Button
            style={{ paddingHorizontal: 0 }}
            appearance="ghost"
            status="basic"
            accessoryLeft={(props) => <Icon {...props} name="edit-outline" />}
            onPress={() => navigation.push('EditScreen', { id })}
          />
        </View>
      ),
    });
  }, [id, navigation, share, timer]);

  return (
    <Layout style={styles.container}>
      <ScrollView>
        {timer ? (
          <View style={{ margin: '5%' }}>
            {timer.description ? (
              <Text category="s1" style={{ paddingBottom: 14 }}>
                {timer.description}
              </Text>
            ) : null}
            <RunControls
              actions={timer.flow}
              setActiveNode={setActiveNodeIndex}
              setLabelOverrides={setLabelOverrides}
              setProgress={setProgress}
            />
            <ViewableFlow
              style={{ paddingTop: 10 }}
              actions={timer.flow}
              progress={progress}
              activeNodeIndex={activeNodeIndex}
              labelOverrides={labelOverrides}
            />
          </View>
        ) : null}
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ViewScreen;
