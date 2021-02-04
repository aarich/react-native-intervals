import {
  AppActionTypes,
  RESET,
  SET_SETTINGS,
  SettingsActionTypes,
  UPDATE_SETTING,
} from '../actions/actionTypes';

export enum AdType {
  Personal = 'Personal',
  Generic = 'Generic',
  Off = 'Off',
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

export type AnySetting =
  | adSetting
  | themeSetting
  | countUpSetting
  | totalTimeSetting
  | hideDescription;

export type BooleanSettings = countUpSetting &
  totalTimeSetting &
  hideDescription;

export type SelectSettings = adSetting & themeSetting;

export type SettingsState = SelectSettings & BooleanSettings;

const initialState: SettingsState = {
  ads: AdType.Generic,
  theme: ThemeType.System,
  countUp: true,
  showTotalTime: true,
  hideDescription: false,
};

const reducer = (
  state: SettingsState = initialState,
  action: SettingsActionTypes | AppActionTypes
): SettingsState => {
  switch (action.type) {
    case SET_SETTINGS:
      return action.payload;
    case UPDATE_SETTING:
      return { ...state, ...action.payload };
    case RESET:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
