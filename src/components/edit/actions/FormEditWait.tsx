import { BaseFormEditProps } from './FormEdit';
import React from 'react';
import { Text } from '@ui-kitten/components';
import TimeInput from './TimeInput';

const FormEditWait = ({
  params,
  setParams,
  timeUnitIsSeconds,
}: BaseFormEditProps) => {
  return (
    <>
      <Text category="s1" style={{ paddingBottom: 10 }}>
        Wait for the specified amount of time
      </Text>
      <TimeInput
        valueInSecs={params.time}
        label="How long to wait?"
        onChangeValue={(time) => setParams((params) => ({ ...params, time }))}
        timeUnitIsSeconds={timeUnitIsSeconds}
      />
    </>
  );
};

export default FormEditWait;
