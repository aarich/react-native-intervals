import {
  Button,
  Card,
  IndexPath,
  Modal,
  Select,
  SelectItem,
  Text,
} from '@ui-kitten/components';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Action } from '../../types';
import { FlowTemplateLibrary } from '../../utils/templates';
import { useTimers } from '../../redux/selectors';

type Props = {
  onSetTemplate: (nodes: Action[], title: string, description: string) => void;
  modalState: ModalState;
  onClose: () => void;
};

export enum ModalState {
  HIDDEN,
  SAMPLE,
  DUPLICATE,
}

const useTimerLibrary = (): {
  title: string;
  description: string;
  nodes: Action[];
}[] => {
  const timers = useTimers();

  return Object.values(timers).map((t) => ({
    title: t.name,
    description: t.description ?? '',
    nodes: JSON.parse(JSON.stringify(t.flow)),
  }));
};

const LoadSampleOverlay = ({ onSetTemplate, modalState, onClose }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isDuplicating = modalState === ModalState.DUPLICATE;
  const createdTimerLibrary = useTimerLibrary();
  const library = isDuplicating ? createdTimerLibrary : FlowTemplateLibrary;

  useEffect(() => {
    // Reset to 0 to avoid going out of bounds if the library changes
    setSelectedIndex((prev) => (prev >= library.length ? 0 : prev));
  }, [library]);

  const { nodes, title, description } = library[selectedIndex] ?? {};
  return (
    <Modal
      visible={modalState != ModalState.HIDDEN}
      backdropStyle={styles.backdrop}
      onBackdropPress={onClose}
      style={{ width: '95%' }}>
      <Card
        disabled={true}
        header={(props) => (
          <View {...props}>
            <Text category="h5">
              {isDuplicating ? 'Copy an existing' : 'Load a sample'} flow
            </Text>
          </View>
        )}
        footer={(props) => (
          <View {...props}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Button appearance="ghost" onPress={onClose}>
                Cancel
              </Button>
              <Button
                status="primary"
                onPress={() => onSetTemplate(nodes, title, description)}>
                Choose
              </Button>
            </View>
          </View>
        )}>
        <Select
          selectedIndex={new IndexPath(selectedIndex)}
          onSelect={(i) => setSelectedIndex((i as IndexPath).row)}
          value={title}>
          {library.map(({ title }, i) => (
            <SelectItem title={title} key={i} />
          ))}
        </Select>
        <Text category="s2" style={{ paddingTop: 20, paddingHorizontal: 8 }}>
          {' '}
          {description}
        </Text>
      </Card>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default LoadSampleOverlay;
