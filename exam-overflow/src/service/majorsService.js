import axios from "axios";

export async function postMajor(name) {
  return axios.post("/majors", { name }).then((data) => data.data);
}
