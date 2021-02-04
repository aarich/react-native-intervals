import {
  AnyBooleanSetting,
  AnySetting,
  SettingsState,
} from '../reducers/settingsReducer';
import {
  AppActionTypes,
  DELETE_TIMER,
  RESET,
  SET_SETTINGS,
  SET_TIMERS,
  SettingsActionTypes,
  TimerActionTypes,
  UPDATE_SETTING,
  UPSERT_TIMER,
} from './actionTypes';

import { Timer } from '../../types';

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
  update: AnyBooleanSetting
): SettingsActionTypes => ({
  type: UPDATE_SETTING,
  payload: update,
});
