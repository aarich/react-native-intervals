import {
  Icon,
  IndexPath,
  Input,
  Select,
  SelectItem,
  Text,
} from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';

import { Action } from '../../types';
import { BaseFormEditProps } from './FormEdit';

const getNameFromAction = (action: Action) =>
  'name' in action.params
    ? action.params.name
    : action.type + ' ' + action.index;

const FormEditGoTo = ({
  params,
  setParams,
  insertIndex,
  existingActions,
}: BaseFormEditProps) => {
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));

  const availableActions = existingActions.filter((_, i) => i < insertIndex);

  useEffect(() => {
    setParams({
      ...params,
      targetNode: availableActions[selectedIndex.row].index + '',
    });
  }, [availableActions, params, selectedIndex, setParams]);

  return (
    <>
      <Text category="s1" style={{ paddingBottom: 10 }}>
        Go back to a previous node. Use this for repeats.
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
        value={params?.times ? params?.times + '' : ''}
        label="How many times?"
        placeholder="Enter a number"
        onChangeText={(times) => setParams({ ...params, times })}
        accessoryRight={(props) => <Icon {...props} name="hash-outline" />}
      />
    </>
  );
};

export default FormEditGoTo;
