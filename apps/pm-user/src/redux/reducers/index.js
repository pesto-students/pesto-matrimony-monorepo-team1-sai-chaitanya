import { combineReducers } from "redux";
import { submitFormDataReducer } from './Reducers';


const reducers = combineReducers({
    formSubmitResonse: submitFormDataReducer, //first reducer function
});

//exporting it to src/redux/store.js file
export default reducers;

