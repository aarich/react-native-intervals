import { Button, Text } from '@ui-kitten/components';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Action } from '../../types';
import LoadSampleOverlay, { ModalState } from './LoadSampleOverlay';

type Props = {
  onSetTemplate: (nodes: Action[], title: string, description: string) => void;
};

const EmptyCanvasHelp = ({ onSetTemplate }: Props) => {
  const [modalState, setModalState] = useState(ModalState.HIDDEN);
  return (
    <View style={styles.container}>
      <LoadSampleOverlay
        modalState={modalState}
        onSetTemplate={(n, t, d) => {
          setModalState(ModalState.HIDDEN);
          onSetTemplate(n, t, d);
        }}
        onClose={() => setModalState(ModalState.HIDDEN)}
      />
      <View style={{ flex: 1 }}>
        <Text category="h1">Need Inspiration?</Text>
        <Text
          category="s1"
          style={{ textAlign: 'center', paddingVertical: 15 }}>
          Load a sample template to get started.
        </Text>
        <Button
          appearance="outline"
          onPress={() => setModalState(ModalState.SAMPLE)}>
          Browse Samples
        </Button>
        <Button
          appearance="outline"
          onPress={() => setModalState(ModalState.DUPLICATE)}
          style={{ marginVertical: 15 }}>
          Copy an Existing Flow
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
