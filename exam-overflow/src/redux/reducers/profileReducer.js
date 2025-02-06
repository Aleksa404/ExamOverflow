import { LOAD_PROFILE, LOAD_PROFILE_SUCCESSFUL, LOAD_PROFILE_FAILURE, SET_MY_PROFILE } from "../types";

const initialState = {
  user: undefined,
  loading: false,
  error: "",
  myProfile: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOAD_PROFILE:
      return { ...state, loading: true, error: "", myProfile: false };
    case LOAD_PROFILE_SUCCESSFUL:
      return { ...state, loading: false, user: action.payload, error: "" };
    case LOAD_PROFILE_FAILURE:
      return { ...state, user: undefined, loading: false, error: action.payload };
    case SET_MY_PROFILE:
      return { ...state, myProfile: true };
    default:
      return state;
  }
}
