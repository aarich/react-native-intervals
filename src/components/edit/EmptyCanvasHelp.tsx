import { Button, Text } from '@ui-kitten/components';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Action } from '../../types';
import LoadSampleOverlay from './LoadSampleOverlay';

type Props = {
  onSetTemplate: (nodes: Action[], title: string, description: string) => void;
};

const EmptyCanvasHelp = ({ onSetTemplate }: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.container}>
      <LoadSampleOverlay
        visible={modalVisible}
        onSetTemplate={(n, t, d) => {
          setModalVisible(false);
          onSetTemplate(n, t, d);
        }}
        onClose={() => setModalVisible(false)}
      />
      <View style={{ flex: 1 }}>
        <Text category="h1">Need Inspiration?</Text>
        <Text
          category="s1"
          style={{ textAlign: 'center', paddingVertical: 15 }}
        >
          Load a sample template to get started.
        </Text>
        <Button appearance="outline" onPress={() => setModalVisible(true)}>
          Browse Examples
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
});

export default EmptyCanvasHelp;
