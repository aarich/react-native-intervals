import { Timer } from '../../types';
import { TimersState } from '../reducers/timersReducer';
import { useSelector } from 'react-redux';

interface RootState {
  timers: TimersState;
}

export const useTimers = () => useSelector((state: RootState) => state.timers);

export const useTimer = (id: string): Timer | undefined => useTimers()[id];
