import {
  IS_LIVE_ACTIVITY_AVAILABLE,
  SettingsState,
} from '../reducers/settingsReducer';
import { useSelector } from 'react-redux';

interface RootState {
  settings: SettingsState;
}

type Setting = keyof SettingsState;

export const useSettings = () =>
  useSelector((state: RootState) => state.settings);

export const useSetting = <T extends Setting>(key: T): SettingsState[T] => {
  const settings = useSettings();

  if (key === 'hideLiveActivity' && !IS_LIVE_ACTIVITY_AVAILABLE) {
    return false as SettingsState[T];
  }

  return settings[key];
};
