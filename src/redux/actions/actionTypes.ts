import { Timer } from '../../types';

/*
 * TIMERS
 */
export const SET_TIMERS = 'SET_TIMERS';
export const UPSERT_TIMER = 'UPDATE_TIMER';
// export const CREATE_TIMER = 'CREATE_TIMER';

interface SetTimersAction {
  type: typeof SET_TIMERS;
  payload: Timer[];
}

interface UpsertTimerAction {
  type: typeof UPSERT_TIMER;
  payload: Timer;
}

export type TimerActionTypes = SetTimersAction | UpsertTimerAction;
// | CreateTimerAction;
