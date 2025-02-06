import axios from "axios";

export async function getCourse(id) {
  return axios.get(`/courses/${id}`).then((data) => data.data);
}

export async function postCourse(name, year, majorId) {
  return axios.post("/courses", { name, year, majorId }).then((data) => data.data);
}
