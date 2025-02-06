import axios from "axios";

export async function login(email, password) {
  return axios.post("/login", { email, password }).then((data) => data.data);
}

export async function getUser(id) {
  return axios.get(`/users/${id}`).then((data) => data.data);
}

export async function getUserAvatar(id) {
  return axios.get(`/users/avatar/${id}`).then((data) => data.data);
}

export async function uploadProfileImage(file) {
  let axiosInstance = axios.create({
    baseURL: "http://localhost:9090/exam_paper",
    headers: { "X-Custom-Header": "foobar" },
  });
  const formData = new FormData();
  formData.set("avatar", file);
  return axiosInstance
    .post("http://localhost:9090/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data", mode: "no-cors" },
    })
    .then((data) => `http://localhost:9090/${data.data.avatarUrl}`);
}

export async function editUsernameAvatar(userId, userName, avatar) {
  const body = { userName, avatar };
  return axios.post(`/users/edit/${userId}`, body).then((data) => data.data);
}

export async function addAdmin(email) {
  return axios.post(`/updateUserRole`, { email }).then((data) => data.data);
}

export async function removeAdmin(email) {
  return axios.post(`/removeUserRole`, { email }).then((data) => data.data);
}

export async function getUserByEmail(email) {
  return axios.get(`/users?email=${email}`).then((data) => data.data);
}

export async function banUser(userID) {
  return axios.get(`/users/ban/${userID}`).then((data) => data.data);
}
