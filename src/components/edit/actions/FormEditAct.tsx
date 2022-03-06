import { BaseFormEditProps } from './FormEdit';
import Input from '../../shared/Input';
import { Text } from '@ui-kitten/components';
import TimeInput from './TimeInput';

const FormEditAct = ({
  params,
  setParams,
  timeUnitIsSeconds,
}: BaseFormEditProps) => {
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
      <TimeInput
        label={`How long is this action?`}
        valueInSecs={params.time}
        onChangeValue={(time) =>
          setParams((params) => ({
            ...params,
            time,
          }))
        }
        timeUnitIsSeconds={timeUnitIsSeconds}
      />
    </>
  );
};

export default FormEditAct;
