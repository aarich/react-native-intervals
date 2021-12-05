import { Timer } from '../../types';
import {
  AnySetting,
  BooleanSettings,
  SettingsState,
} from '../reducers/settingsReducer';
import {
  AppActionTypes,
  DELETE_TIMER,
  RESET,
  SettingsActionTypes,
  SET_SETTINGS,
  SET_TIMERS,
  TimerActionTypes,
  UPDATE_SETTING,
  UPSERT_TIMER,
} from './actionTypes';

export const resetApp = (): AppActionTypes => ({ type: RESET });

export const setTimers = (timers: Timer[]): TimerActionTypes => ({
  type: SET_TIMERS,
  payload: timers,
});
export const saveTimer = (timer: Timer): TimerActionTypes => ({
  type: UPSERT_TIMER,
  payload: timer,
});
export const deleteTimer = (id: string): TimerActionTypes => ({
  type: DELETE_TIMER,
  payload: id,
});

export const setSettings = (settings: SettingsState): SettingsActionTypes => ({
  type: SET_SETTINGS,
  payload: settings,
});
export const updateSetting = (update: AnySetting): SettingsActionTypes => ({
  type: UPDATE_SETTING,
  payload: update,
});
export const updateBooleanSetting = (
  update: BooleanSettings
): SettingsActionTypes => ({
  type: UPDATE_SETTING,
  payload: update,
});
