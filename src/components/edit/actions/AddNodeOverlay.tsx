import { Action, ActionType } from '../../../types';
import { Button, Card, Modal, Text } from '@ui-kitten/components';
import { Keyboard, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';

import FormEdit from './FormEdit';
import { getActionInfo } from '../../../utils/actions';

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
  return (
    <Modal
      visible={isVisible}
      backdropStyle={styles.backdrop}
      onBackdropPress={() => Keyboard.dismiss()}
    >
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
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default AddNodeOverlay;
