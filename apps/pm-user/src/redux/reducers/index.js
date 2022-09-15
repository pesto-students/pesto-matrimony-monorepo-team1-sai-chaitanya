import { combineReducers } from 'redux';
import { createUserInOktaAndMongoDbReducer, getUserProfileReducer, getUserProfileForSideBarReducer, updateUserProfileReducer, updateUserImageReducer } from './Reducers';

const reducers = combineReducers({
  getUserProfileResponse: getUserProfileReducer, //first reducer function
  updateUserProfileReducer : updateUserProfileReducer,
  getUserProfileForSideBarReducer,
  updateUserImageReducer,
  createUserInOktaAndMongoDbReducer
});

//exporting it to src/redux/store.js file
export default reducers;
