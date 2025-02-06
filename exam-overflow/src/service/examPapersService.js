import axios from "axios";

export async function getMajors() {
  return axios.get("/majors/").then((data) => data.data);
}

export async function getCourses(majorId, year) {
  return axios.get(`/courses?id=${majorId}&year=${year}`).then((data) => data.data);
}

export async function getAllCourses() {
  return axios.get(`/courses`).then((data) => data.data);
}

export async function getExamPapers(courseId) {
  return axios.get(`/exampapers?id=${courseId}`).then((data) => data.data);
}

export async function getUnapprovedExamPapers() {
  return axios.get(`/exampapers/unapproved`).then((data) => data.data);
}

export async function getExamPaper(examPaperId) {
  return axios.get(`/exampapers/${examPaperId}`).then((data) => data.data);
}

export async function getExamPaperUrl(examPaperId) {
  return axios.get(`/exampapers/${examPaperId}`).then((data) => data.data.documentUrl);
}

export async function postExamPaper(courseId, examType, year, term, file) {
  let axiosInstance = axios.create({
    baseURL: "http://localhost:9090/exam_paper",
    headers: { "X-Custom-Header": "foobar" },
  });
  const formData = new FormData();
  formData.set("exam_paper", file);
  return axiosInstance
    .post("http://localhost:9090/exam_paper", formData, {
      headers: { "Content-Type": "multipart/form-data", mode: "no-cors" },
    })
    .then((res) => {
      return axios.post(`/exampapers`, {
        courseId,
        type: examType,
        year,
        term,
        documentUrl: "http://localhost:9090/" + res.data.documentUrl,
      });
    });
}

export async function approveExamPaper(id) {
  return axios.get(`exampapers/approve/${id}`).then((data) => data.data);
}

export async function deleteExampaper(id) {
  return axios.delete(`exampapers/unapprove/${id}`).then((data) => data.data);
}

export async function getUnapprovedExamPapersCount() {
  return axios.get(`exampapers/unapprovedCount`).then((data) => data.data);
}
