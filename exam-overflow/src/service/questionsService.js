import axios from "axios";
import jwt from "jwt-decode";

export async function postQuestion(userID, title, content, examPaperId) {
  return axios.post(`/questions`, { userID, title, content, examPaperId }).then((data) => data.data);
}

export async function getQuestion(questionId) {
  return axios.get(`/questions/${questionId}`).then((data) => data.data);
}

export async function getQuestions(examPaperId) {
  return axios.get(`/questions?id=${examPaperId}`).then((data) => data.data);
}

export async function likeQuestion(questionId) {
  const token = window.localStorage.TOKEN;
  return axios.get(`/questions/like/${questionId}/${jwt(token).unique_name}`).then((data) => data.data);
}

export async function unLikeQuestion(questionId) {
  const token = window.localStorage.TOKEN;
  return axios.get(`/questions/unlike/${questionId}/${jwt(token).unique_name}`).then((data) => data.data);
}

export async function disLikeQuestion(questionId) {
  const token = window.localStorage.TOKEN;
  return axios.get(`/questions/dislike/${questionId}/${jwt(token).unique_name}`).then((data) => data.data);
}

export async function unDisLikeQuestion(questionId) {
  const token = window.localStorage.TOKEN;
  return axios.get(`/questions/unDislike/${questionId}/${jwt(token).unique_name}`).then((data) => data.data);
}

export async function getReportedQuestions() {
  return axios.get(`/reports`).then((data) => data.data.questionReports);
}

export async function reportQuestion(questionId, content) {
  return axios.post(`/reports/questions`, { questionId, content }).then((data) => data.data);
}

export async function deleteQuestion(questionId) {
  return axios.delete(`/questions/${questionId}`).then((data) => data.data);
}

export async function deleteReportedQuestion(reportId) {
  return axios.delete(`/reports/questions/${reportId}`).then((data) => data.data);
}
