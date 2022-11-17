import { combineReducers } from '@reduxjs/toolkit';
import { getData } from './reducer';
const reducers = combineReducers({ reducer: getData });

export default reducers;
export type RootState = ReturnType<typeof reducers>;
