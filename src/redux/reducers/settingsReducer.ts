import {
  AppActionTypes,
  RESET,
  SET_SETTINGS,
  SettingsActionTypes,
  UPDATE_SETTING,
} from '../actions/actionTypes';

export enum AdType {
  /** @deprecated since 2.0 */
  Personal = 'Personal',
  /** @deprecated since 2.0 */
  Generic = 'Generic',
  Off = 'Off',
  On = 'On',
}
export enum ThemeType {
  Light = 'Light',
  Dark = 'Dark',
  System = 'System',
}

type adSetting = { ads: AdType };
type themeSetting = { theme: ThemeType };
type countUpSetting = { countUp: boolean };
type totalTimeSetting = { showTotalTime: boolean };
type hideDescription = { hideDescription: boolean };
// other
type adLastResetSetting = { adLastReset: number };

export type AnySetting =
  | adSetting
  | themeSetting
  | countUpSetting
  | totalTimeSetting
  | hideDescription
  | adLastResetSetting;

export type BooleanSettings = countUpSetting &
  totalTimeSetting &
  hideDescription;

export type SelectSettings = adSetting & themeSetting;

export type SettingsState = SelectSettings &
  BooleanSettings &
  adLastResetSetting;

export const initialState: SettingsState = {
  ads: AdType.Generic,
  theme: ThemeType.System,
  countUp: true,
  showTotalTime: true,
  hideDescription: false,
  adLastReset: Date.now(),
};

const reducer = (
  state: SettingsState = initialState,
  action: SettingsActionTypes | AppActionTypes
): SettingsState => {
  switch (action.type) {
    case SET_SETTINGS:
      return action.payload;
    case UPDATE_SETTING: {
      if ('ads' in action.payload) {
        return { ...state, ...action.payload, adLastReset: Date.now() };
      }
      return { ...state, ...action.payload };
    }
    case RESET:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
