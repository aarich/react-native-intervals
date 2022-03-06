import { Text } from '@ui-kitten/components';
import Input from '../../shared/Input';
import { BaseFormEditProps } from './FormEdit';

const FormEditPause = ({ params, setParams }: BaseFormEditProps) => {
  return (
    <>
      <Text category="s1" style={{ paddingBottom: 10 }}>
        Pause the flow so you can do something not time-based.
      </Text>
      <Input
        value={params.name || ''}
        label="What is the pause action?"
        placeholder="Enter a name"
        onChangeText={(name) => setParams((params) => ({ ...params, name }))}
        iconRight="text-outline"
      />
    </>
  );
};

export default FormEditPause;
