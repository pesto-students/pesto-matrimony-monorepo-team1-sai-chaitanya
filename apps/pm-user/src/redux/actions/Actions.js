import { ActionTypes } from '../constants';
import axios from 'axios';
// import Apis from "../../apis";


const localHost = 'http://localhost:8000';
const herokuHost = 'https://pmapi-pesto.herokuapp.com';
const baseUrl = localHost;

// to get user's profile data in sidebar
export const getUserProfileForSideBar = (oktaUserId) => {
  // console.log(oktaUserId); 
  return async (dispatch) => {
    try {
      const url = `${baseUrl}/api/v1/users/userprofile/${oktaUserId}`;

      const response = await axios.get(url);

      dispatch({
        type: ActionTypes.GET_USER_PROFILE_SIDEBAR,
        payload: response.data.currentUser[0],
      });
    } catch (err) {
      console.log(err);
    }
  };
};


//to get user's profile data
export const getUserProfile = (oktaUserId) => {
  
  return async (dispatch) => {
    try {
      const url = `${baseUrl}/api/v1/users/userprofile/${oktaUserId}`;

      const response = await axios.get(url);

      dispatch({
        type: ActionTypes.GET_USER_PROFILE,
        payload: response.data.currentUser[0],
      });
    } catch (err) {
      console.log(err);
    }
  };
};

//to update the user data
export const updateUserProfile = (oktaUserId, value) => {
  try {
    return async (dispatch) => {
      const url = `${baseUrl}/api/v1/users/${oktaUserId}`;
      const response = await axios.put(url, value);
      dispatch({
        type: ActionTypes.UPDATE_USER_PROFILE,
        payload: response,
      });
    };
  } catch (err) {
    console.log(err);
  }
};

//to update user's image
export const updateUserImage = (oktaUserId, fileObj) => {
  return async (dispatch) => {
    try {
      const formData = new FormData();
      // console.log(uploadImage);
      formData.append('file', fileObj);
      formData.append('upload_preset', 'lb3xedsh');

      //submiting image on cloudinary
      const responseClodinary = await axios.post(
        'https://api.cloudinary.com/v1_1/pesto-matrimony/image/upload',
        formData
      );
      const imageUrlString = responseClodinary.data.url;

      const payload = {
        oktaUserId,
        imageUrlString,
      };

      //submitting image on mongodb
      const url = `${baseUrl}/api/v1/users/imageupload`;
      const response = await axios.post(url, payload);
      console.log(response);
      dispatch({
        type: ActionTypes.UPDATE_USER_IMAGE,
        payload: response,
      });
    } catch (err) {
      console.log(err);
    }
  };
};
