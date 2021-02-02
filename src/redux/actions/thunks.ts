import { AppThunk } from '../store';
import { setTimers } from '.';

export const loadTimers = (): AppThunk<void> => (dispatch) =>
  Promise.resolve().then(() => {
    const timers = [
      { id: '1', name: '1', flow: [] },
      { id: '2', name: '2', flow: [] },
      { id: '3', name: '3', flow: [] },
    ];
    dispatch(setTimers(timers));
    return Promise.resolve();
  });
