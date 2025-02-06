import {
  LOAD_PROFILE_FAILURE,
  LOAD_PROFILE,
  LOAD_PROFILE_SUCCESSFUL,
  SET_MY_PROFILE,
  CHANGE_USERNAME_AVATAR,
} from "../types";
import { getUser } from "../../service/userService";

import jwtDecode from "jwt-decode";

export const loadProfile = (userId) => (dispatch) => {
  dispatch({ type: LOAD_PROFILE });
  getUser(userId)
    .then((user) => {
      dispatch({ type: LOAD_PROFILE_SUCCESSFUL, payload: user });
      const token = localStorage.TOKEN;
      if (token) {
        const decodedToken = jwtDecode(token);
        if (decodedToken.unique_name === user.id) {
          dispatch({ type: SET_MY_PROFILE });
        }
      }
    })
    .catch((err) => {
      dispatch({ type: LOAD_PROFILE_FAILURE, payload: err.message });
    });
};

export const changeUsernameAvatar = (user, username, avatar) => (dispatch) => {
  const changedUser = { ...user, userName: username, avatar: avatar };
  dispatch({ type: CHANGE_USERNAME_AVATAR, payload: changedUser });
};
