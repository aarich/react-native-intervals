import { Icon, Input as UIKInput } from '@ui-kitten/components';
import { StyleProp, TextStyle, View } from 'react-native';

import useColorScheme from '../../hooks/useColorScheme';

type Props = {
  style?: StyleProp<TextStyle>;
  value: string | number;
  label?: string;
  placeholder: string;
  onChangeText: (newText: string) => void;
  iconRight?: string;
  numeric?: boolean;
};

const Input = ({ value, iconRight, numeric = false, ...otherProps }: Props) => {
  const inputMode = (numeric || typeof value === 'number') ? 'numeric' : undefined;
  const scheme = useColorScheme();
  return (
    <View style={{ paddingTop: 5 }}>
      <UIKInput
        {...otherProps}
        value={value + ''}
        accessoryRight={
          iconRight
            ? (props) => <Icon {...props} name={iconRight} />
            : undefined
        }
        inputMode={inputMode}
        keyboardAppearance={scheme}
      />
    </View>
  );
};

export default Input;
