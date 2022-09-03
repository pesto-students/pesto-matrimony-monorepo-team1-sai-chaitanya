import { ActionTypes } from "../constants";
import Apis from "../../apis"; 


export const submitFormData = () => {
    return async (dispatch) => {

        //in "fakeStoreApi.get("/products")" the api-url coming from the axios.create() from src/apis/fakeStoreApi.js.
        const response = await Apis.post("/data");
        
        dispatch({
            type: ActionTypes.FORM_SUBMIT,
            payload: response.data
        });
    };
};