import { createStore } from 'redux';
import reducers from './compileStore';
const store = createStore(reducers);

export default store;
