import { Button, Card, Modal, Text } from '@ui-kitten/components';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Keyboard, StyleSheet, View } from 'react-native';
import { useKeyboardSize } from '../../../hooks/useKeyboardSize';
import { Action, ActionType } from '../../../types';
import { getActionInfo } from '../../../utils/actions';
import FormEdit from './FormEdit';

type Props = {
  typeToCreate?: ActionType;
  actionToEdit?: Action;
  onSave: (newActionDraft: Record<string, string>) => void;
  onCancel: () => void;
  existingActions: Action[];
  insertIndex: number;
};

const AddNodeOverlay = ({
  typeToCreate,
  actionToEdit,
  onSave,
  onCancel,
  existingActions,
  insertIndex,
}: Props) => {
  const [draft, setDraft] = useState(actionToEdit?.params || {});

  useEffect(() => {
    setDraft(actionToEdit?.params || {});
    // any change should reset the draft
  }, [actionToEdit, existingActions, insertIndex]);

  const isVisible = !!(typeToCreate || actionToEdit);
  const type = typeToCreate || actionToEdit?.type;
  const typeLabel = type && getActionInfo(type).label;
  const keyboardSize = useKeyboardSize();

  const paddingBottom = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(paddingBottom, {
      toValue: keyboardSize / 2,
      duration: 200,
      useNativeDriver: false,
      easing: Easing.quad,
    }).start();
  }, [keyboardSize, paddingBottom]);

  return (
    <Modal
      visible={isVisible}
      onBackdropPress={Keyboard.dismiss}
      backdropStyle={styles.backdrop}
    >
      <Animated.View style={{ paddingBottom }}>
        <Card
          disabled={true}
          header={(props) => (
            <View {...props}>
              <Text category="h5">
                {`${typeToCreate ? 'Add' : 'Edit'} ${typeLabel}`}
              </Text>
            </View>
          )}
          footer={(props) => (
            <View {...props}>
              <View
                style={{ flexDirection: 'row', justifyContent: 'flex-end' }}
              >
                <Button appearance="ghost" onPress={onCancel}>
                  Cancel
                </Button>
                <Button status="primary" onPress={() => onSave(draft)}>
                  {typeToCreate ? 'Add' : 'Save'}
                </Button>
              </View>
            </View>
          )}
        >
          {type ? (
            <FormEdit
              type={type}
              params={draft}
              setParams={setDraft}
              existingActions={existingActions}
              insertIndex={actionToEdit?.index || insertIndex}
            />
          ) : null}
        </Card>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default AddNodeOverlay;
