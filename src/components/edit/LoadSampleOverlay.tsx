import {
  Button,
  Card,
  IndexPath,
  Modal,
  Select,
  SelectItem,
  Text,
} from '@ui-kitten/components';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Action } from '../../types';
import { FlowTemplateLibrary } from '../../utils/templates';

type Props = {
  onSetTemplate: (nodes: Action[], title: string, description: string) => void;
  visible: boolean;
  onClose: () => void;
};

const LoadSampleOverlay = ({ onSetTemplate, visible, onClose }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { nodes, title, description } = FlowTemplateLibrary[selectedIndex];
  return (
    <Modal
      visible={visible}
      backdropStyle={styles.backdrop}
      onBackdropPress={onClose}
      style={{ width: '95%' }}
    >
      <Card
        disabled={true}
        header={(props) => (
          <View {...props}>
            <Text category="h5">Load a sample flow</Text>
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
                onPress={() => onSetTemplate(nodes, title, description)}
              >
                Choose
              </Button>
            </View>
          </View>
        )}
      >
        <Select
          selectedIndex={new IndexPath(selectedIndex)}
          onSelect={(i) => setSelectedIndex((i as IndexPath).row)}
          value={title}
        >
          {FlowTemplateLibrary.map(({ title }, i) => (
            <SelectItem title={title} key={i} />
          ))}
        </Select>
        <Text category="s1" style={{ paddingTop: 20 }}>
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
