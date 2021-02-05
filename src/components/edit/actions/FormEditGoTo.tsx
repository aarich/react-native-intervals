import { Action, ActionType } from '../../../types';
import { IndexPath, Select, SelectItem, Text } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';

import { AUDIO_FILES } from '../../../utils/audio';
import { BaseFormEditProps } from './FormEdit';
import Input from '../../shared/Input';
import { getActionInfo } from '../../../utils/actions';

const getNameFromAction = (action: Action) => {
  const step = action.index + 1;
  let name;
  switch (action.type) {
    case ActionType.sound:
      name = `Play ${AUDIO_FILES[action.params.sound].name}`;
      break;
    case ActionType.act:
      name = action.params.name;
      break;
    case ActionType.wait:
      name = getActionInfo(ActionType.wait).getDetails(action);
      break;
  }

  return `${step}: ${name}`;
};

const FormEditGoTo = ({
  params,
  setParams,
  insertIndex,
  existingActions,
}: BaseFormEditProps) => {
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));

  const reversedActionsBeforeThis = existingActions
    .filter((_, i) => i < insertIndex)
    .reverse();

  const firstGoToIndex = reversedActionsBeforeThis.findIndex(
    (action) => action.type === ActionType.goTo
  );
  const availableActions = reversedActionsBeforeThis.filter(
    (_, i) => firstGoToIndex === -1 || i < firstGoToIndex
  );

  useEffect(() => {
    setParams((params) => ({
      ...params,
      targetNode: availableActions[selectedIndex.row].index,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex]);

  return (
    <>
      <Text category="s2" style={{ paddingBottom: 10 }}>
        Go back to a previous node. Use this for repeats. This is the number of
        times the steps before this will run.
      </Text>
      <Select
        label="Return to which node?"
        selectedIndex={selectedIndex}
        onSelect={(i) => setSelectedIndex(i as IndexPath)}
        value={getNameFromAction(availableActions[selectedIndex.row])}
      >
        {availableActions.map((action, i) => (
          <SelectItem title={getNameFromAction(action)} key={i} />
        ))}
      </Select>
      <Input
        style={{ paddingTop: 8 }}
        value={params.times || ''}
        label="How many times? A value of 1 means there are no repetitions."
        placeholder="Enter a number"
        onChangeText={(times) => setParams((params) => ({ ...params, times }))}
        iconRight="hash-outline"
        numeric
      />
    </>
  );
};

export default FormEditGoTo;
