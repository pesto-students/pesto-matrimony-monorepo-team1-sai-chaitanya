import { ActionTypes } from '../constants';
import axios from 'axios';
// import Apis from "../../apis";

export const getUserProfile = (oktaUserId) => {
  return async (dispatch) => {
    const url = `http://localhost:8000/api/v1/users/userprofile/${oktaUserId}`;

    const response = await axios.get(url);

    dispatch({
      type: ActionTypes.GET_USER_PROFILE,
      payload: response.data.user[0],
    });
  };
};
