import {
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
  action: TimerActionTypes
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
    default:
      return state;
  }
};

export default reducer;
