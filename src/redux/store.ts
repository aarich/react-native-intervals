import { Action, AnyAction, applyMiddleware, createStore } from 'redux';
import rootReducer, { RootState } from './reducers';
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { useDispatch } from 'react-redux';

const store = createStore(rootReducer, {}, applyMiddleware(thunk));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppDispatch = ThunkDispatch<RootState, any, AnyAction>;
export type AppThunk<ReturnType = void> = ThunkAction<
  Promise<ReturnType>,
  RootState,
  undefined,
  Action<string>
>;

export const useAppDispatch = (): AppDispatch => useDispatch();

export default store;
