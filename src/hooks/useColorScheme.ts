import { useColorScheme as _useColorScheme } from 'react-native';
import { ThemeType } from '../redux/reducers/settingsReducer';
import { useSetting } from '../redux/selectors';

// The useColorScheme value is always either light or dark, but the built-in
// type suggests that it can be null. This will not happen in practice, so this
// makes it a bit easier to work with.
export default function useColorScheme(): 'light' | 'dark' {
  const setting = useSetting('theme');
  const system = _useColorScheme();

  const mapping: Record<string, 'light' | 'dark'> = {
    [ThemeType.Dark]: 'dark',
    [ThemeType.Light]: 'light',
    [ThemeType.System]: system === 'unspecified' ? 'dark' : system,
  };

  return mapping[setting];
}
