import { combineReducers } from 'redux';
import { getUserProfileReducer } from './Reducers';

const reducers = combineReducers({
  getUserProfileResponse: getUserProfileReducer, //first reducer function
});

//exporting it to src/redux/store.js file
export default reducers;
