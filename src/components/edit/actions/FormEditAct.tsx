import { BaseFormEditProps } from './FormEdit';
import Input from '../../shared/Input';
import React from 'react';
import { Text } from '@ui-kitten/components';

const FormEditAct = ({ params, setParams }: BaseFormEditProps) => {
  return (
    <>
      <Text category="s1" style={{ paddingBottom: 10 }}>
        Perform an action for the specified amount of time
      </Text>
      <Input
        value={params.name || ''}
        label="What is the action?"
        placeholder="Enter a name"
        onChangeText={(name) => setParams((params) => ({ ...params, name }))}
        iconRight="text-outline"
      />
      <Input
        value={params.time || ''}
        label="How long to do this action, in seconds?"
        placeholder="Enter a number"
        onChangeText={(time) => setParams((params) => ({ ...params, time }))}
        iconRight="hash-outline"
        numeric
      />
    </>
  );
};

export default FormEditAct;
