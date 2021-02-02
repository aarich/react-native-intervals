import { Icon, Input, Text } from '@ui-kitten/components';

import { BaseFormEditProps } from './FormEdit';
import React from 'react';

const FormEditAct = ({ params, setParams }: BaseFormEditProps) => {
  return (
    <>
      <Text category="s1" style={{ paddingBottom: 10 }}>
        Perform an action for the specified amount of time
      </Text>
      <Input
        value={params?.name ? params?.name : ''}
        label="What is the action?"
        placeholder="Enter a name"
        onChangeText={(name) => setParams({ ...params, name })}
        accessoryRight={(props) => <Icon {...props} name="text-outline" />}
      />
      <Input
        value={params?.time ? params?.time + '' : ''}
        label="How long to do this action, in seconds?"
        placeholder="Enter a number"
        onChangeText={(time) => setParams({ ...params, time })}
        accessoryRight={(props) => <Icon {...props} name="hash-outline" />}
      />
    </>
  );
};

export default FormEditAct;
