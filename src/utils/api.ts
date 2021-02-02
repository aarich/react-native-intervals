import { TimersState } from '../redux/reducers/timersReducer';

export const createNewID = (existingTimers: TimersState) => {
  if (Object.keys(existingTimers).length === 0) {
    return '1';
  }

  const sortedIds = Object.keys(existingTimers)
    .map((id) => Number.parseInt(id))
    .sort();

  return `${sortedIds[sortedIds.length - 1] + 1}`;
};
