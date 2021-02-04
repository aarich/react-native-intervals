import { BaseFormEditProps } from './FormEdit';
import Input from '../../shared/Input';
import React from 'react';
import { Text } from '@ui-kitten/components';

const FormEditWait = ({ params, setParams }: BaseFormEditProps) => {
  return (
    <>
      <Text category="s1" style={{ paddingBottom: 10 }}>
        Wait for the specified amount of time
      </Text>
      <Input
        value={params.time || ''}
        label="How long to wait, in seconds?"
        placeholder="Enter a number"
        onChangeText={(time) => setParams((params) => ({ ...params, time }))}
        iconRight="hash-outline"
        numeric
      />
    </>
  );
};

export default FormEditWait;
