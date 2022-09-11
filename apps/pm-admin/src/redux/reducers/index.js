import { combineReducers } from 'redux';
import { getUserProfileReducer, updateUserProfileReducer, updateUserImageReducer } from './Reducers';

const reducers = combineReducers({
  getUserProfileResponse: getUserProfileReducer, //first reducer function
  updateUserProfileReducer : updateUserProfileReducer,
  updateUserImageReducer,
});

//exporting it to src/redux/store.js file
export default reducers;
