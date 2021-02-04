import { AnySetting, SettingsState } from '../reducers/settingsReducer';

import { Timer } from '../../types';

export const RESET = 'RESET';

export const SET_TIMERS = 'SET_TIMERS';
export const UPSERT_TIMER = 'UPDATE_TIMER';
export const DELETE_TIMER = 'DELETE_TIMER';

export const SET_SETTINGS = 'SET_SETTINGS';
export const UPDATE_SETTING = 'UPDATE_SETTING';

interface ResetAction {
  type: typeof RESET;
}

interface SetTimersAction {
  type: typeof SET_TIMERS;
  payload: Timer[];
}
interface UpsertTimerAction {
  type: typeof UPSERT_TIMER;
  payload: Timer;
}
interface DeleteTimerAction {
  type: typeof DELETE_TIMER;
  payload: string;
}

interface SetSettingsAction {
  type: typeof SET_SETTINGS;
  payload: SettingsState;
}
interface UpdateSettingsAction {
  type: typeof UPDATE_SETTING;
  payload: AnySetting;
}

export type AppActionTypes = ResetAction;
export type TimerActionTypes =
  | SetTimersAction
  | UpsertTimerAction
  | DeleteTimerAction;
export type SettingsActionTypes = SetSettingsAction | UpdateSettingsAction;
