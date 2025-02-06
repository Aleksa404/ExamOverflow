import { ADD_COURSE, ADD_COURSE_FAILURE, ADD_COURSE_SUCCESSFUL, SET_COURSE_MESSAGE } from "../types";

import { postCourse } from "../../service/courseService";

export const addCourse = (name, year, majorId) => (dispatch) => {
  if (!name || !year) {
    dispatch({ type: ADD_COURSE_FAILURE, payload: "Preskocili ste neko polje!" });
    return;
  }
  dispatch({ type: ADD_COURSE });
  postCourse(name, year, majorId)
    .then((res) => {
      dispatch({ type: SET_COURSE_MESSAGE, payload: "Uspešno ste dodali " + name });
      dispatch({ type: ADD_COURSE_SUCCESSFUL, payload: res });
    })
    .catch((err) => dispatch({ type: ADD_COURSE_FAILURE, payload: err.message }));
};
