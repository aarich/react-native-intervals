import { SET_TIMERS, TimerActionTypes, UPSERT_TIMER } from './actionTypes';

import { Timer } from '../../types';

/*
 * Timers
 */
export const setTimers = (timers: Timer[]): TimerActionTypes => ({
  type: SET_TIMERS,
  payload: timers,
});

export const saveTimer = (timer: Timer): TimerActionTypes => ({
  type: UPSERT_TIMER,
  payload: timer,
});
