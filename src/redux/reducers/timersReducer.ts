import {
  AppActionTypes,
  DELETE_TIMER,
  RESET,
  SET_TIMERS,
  TimerActionTypes,
  UPSERT_TIMER,
} from '../actions/actionTypes';

import { Timer } from '../../types';

const initialState = {};

export type TimersState = {
  [id: string]: Timer;
};

const reducer = (
  state: TimersState = initialState,
  action: TimerActionTypes | AppActionTypes
): TimersState => {
  switch (action.type) {
    case SET_TIMERS: {
      const result: TimersState = {};
      action.payload.forEach((t) => {
        result[t.id] = t;
      });
      return result;
    }
    case UPSERT_TIMER:
      return { ...state, [action.payload.id]: action.payload };
    case DELETE_TIMER: {
      const newstate = { ...state };
      delete newstate[action.payload];
      return newstate;
    }
    case RESET:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
