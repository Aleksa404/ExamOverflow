import { ADD_COURSE, ADD_COURSE_SUCCESSFUL, ADD_COURSE_FAILURE, SET_COURSE_MESSAGE } from "../types";

const initialState = {
  course: "",
  error: "",
  loading: "",
  message: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_COURSE:
      return {
        ...state,
        loading: true,
        error: undefined,
        message: "",
      };
    case ADD_COURSE_SUCCESSFUL:
      return {
        ...state,
        course: action.payload,
        error: undefined,
        loading: false,
      };
    case ADD_COURSE_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
        message: "",
      };
    case SET_COURSE_MESSAGE:
      return {
        ...state,
        message: action.payload,
      };
    default:
      return state;
  }
}
