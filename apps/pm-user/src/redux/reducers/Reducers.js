import { ActionTypes } from "../constants"


//intial object to pass in the productReducer function as state.
const initialState = {
    products: []   
}

export const submitFormDataReducer = (state = initialState, {type, payload}) => {
    switch(type){
        case ActionTypes.FORM_SUBMIT:
            return { data: payload } 
        default:
            return state                        
    }
}