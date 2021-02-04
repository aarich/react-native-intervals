import { combineReducers } from 'redux';
import settings from './settingsReducer';
import timers from './timersReducer';

const rootReducer = combineReducers({
  timers,
  settings,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
