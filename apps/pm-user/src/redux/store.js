import { createStore, applyMiddleware, compose } from "redux";
import  reducers  from "./reducers/index.js";
import  thunk  from "redux-thunk";

//for is for redux-devtool
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

//the second argument is empty-state
const store = createStore(reducers,  
    composeEnhancers(applyMiddleware(thunk)) //using thunk middleware
);