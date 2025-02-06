import { TOKEN } from "../../service/util";
import {
  LOGIN_USER,
  LOGIN_USER_SUCCESSFUL,
  LOGIN_USER_FAILURE,
  LOGOUT_USER,
  SET_USER,
  CLEAR_ANSWERS,
  CLEAR_QUESTIONS,
  CLEAR_EXAM_PAPERS,
} from "../types";
import { login, getUser } from "../../service/userService";

import jwtDecode from "jwt-decode";
import axios from "axios";

export const authUser = () => (dispatch) => {
  const token = localStorage.TOKEN;
  if (token) {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
      dispatch(logoutUser());
      window.location.href = "/login";
    } else {
      getUser(decodedToken.unique_name)
        .then((res) => {
          dispatch({ type: SET_USER, payload: res });
          dispatch({ type: CLEAR_EXAM_PAPERS });
          dispatch({ type: CLEAR_ANSWERS });
          dispatch({ type: CLEAR_QUESTIONS });
          axios.defaults.headers.common["Authorization"] = token;
        })
        .catch((err) => console.log("Bad token"));
    }
  }
};

export const loginUser = (email, password) => (dispatch) => {
  dispatch({ type: LOGIN_USER });
  login(email, password)
    .then((res) => {
      const token = `Bearer ${res.token}`;
      window.localStorage.setItem(TOKEN, token);
      axios.defaults.headers.common["Authorization"] = token;
      const decodedToken = jwtDecode(token);
      getUser(decodedToken.unique_name)
        .then((res) => {
          dispatch({ type: CLEAR_EXAM_PAPERS });
          dispatch({ type: CLEAR_ANSWERS });
          dispatch({ type: CLEAR_QUESTIONS });
          dispatch({ type: LOGIN_USER_SUCCESSFUL, payload: res });
        })
        .catch((err) => dispatch({ type: LOGIN_USER_FAILURE, payload: err.message }));
    })
    .catch((err) => {
      dispatch({ type: LOGIN_USER_FAILURE, payload: err.message });
    });
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem(TOKEN);
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: LOGOUT_USER });
};
