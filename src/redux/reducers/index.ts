import { combineReducers } from 'redux';
import timers from './timersReducer';

const rootReducer = combineReducers({
  timers,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
