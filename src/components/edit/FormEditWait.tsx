import { Icon, Input, Text } from '@ui-kitten/components';

import { BaseFormEditProps } from './FormEdit';
import React from 'react';

const FormEditWait = ({ params, setParams }: BaseFormEditProps) => {
  console.log(params);
  return (
    <>
      <Text category="s1" style={{ paddingBottom: 10 }}>
        Wait for the specified amount of time
      </Text>
      <Input
        value={params.time ? params.time + '' : ''}
        label="How long to wait, in seconds?"
        placeholder="Enter a number"
        onChangeText={(time) => setParams({ ...params, time })}
        accessoryRight={(props) => <Icon {...props} name="hash-outline" />}
      />
    </>
  );
};

export default FormEditWait;
