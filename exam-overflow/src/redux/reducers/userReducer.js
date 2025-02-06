import {
  LOGIN_USER,
  LOGIN_USER_SUCCESSFUL,
  LOGIN_USER_FAILURE,
  LOGOUT_USER,
  SET_USER,
  CHANGE_USERNAME_AVATAR,
} from "../types";

const initialState = {
  authenticated: false,
  loading: false,
  error: "",
  user: undefined,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        loading: true,
      };
    case LOGIN_USER_SUCCESSFUL:
      return {
        ...state,
        authenticated: true,
        loading: false,
        error: "",
        user: action.payload,
      };
    case LOGIN_USER_FAILURE:
      return {
        ...state,
        authenticated: false,
        loading: false,
        error: action.payload,
        user: undefined,
      };
    case LOGOUT_USER:
      return {
        ...state,
        authenticated: false,
        loading: false,
        error: "",
        user: undefined,
      };
    case SET_USER:
      return {
        ...state,
        authenticated: true,
        loading: false,
        error: "",
        user: action.payload,
      };
    case CHANGE_USERNAME_AVATAR:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}
