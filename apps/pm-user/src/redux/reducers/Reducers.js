import { ActionTypes } from '../constants';

//intial object to pass in the productReducer function as state.
const initialState = {
  userData: [],
};

export const getUserProfileReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.GET_USER_PROFILE:
      return { data: payload };
    default:
      return state;
  }
};
