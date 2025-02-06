import axios from "axios";
import jwt from "jwt-decode";

export async function getAnswers(questionId) {
  return axios.get(`/answers?id=${questionId}`).then((data) => data.data);
}

export async function postAnswer(userID, content, question) {
  return axios.post(`/answers`, { userID, content, questionId: question.id }).then((data) => data.data);
}

export async function likeAnswer(answerId) {
  const token = window.localStorage.TOKEN;
  return axios.get(`/answers/like/${answerId}/${jwt(token).unique_name}`).then((data) => data.data);
}

export async function unLikeAnswer(answerId) {
  const token = window.localStorage.TOKEN;
  return axios.get(`/answers/unlike/${answerId}/${jwt(token).unique_name}`).then((data) => data.data);
}

export async function disLikeAnswer(answerId) {
  const token = window.localStorage.TOKEN;
  return axios.get(`/answers/dislike/${answerId}/${jwt(token).unique_name}`).then((data) => data.data);
}

export async function unDisLikeAnswer(answerId) {
  const token = window.localStorage.TOKEN;
  return axios.get(`/answers/unDislike/${answerId}/${jwt(token).unique_name}`).then((data) => data.data);
}

export async function getReportedAnswers() {
  return axios.get(`/reports`).then((data) => data.data.answerReports);
}

export async function reportAnswer(answerId, content) {
  console.log(answerId, content);
  return axios.post(`/reports/answers`, { answerId, content }).then((data) => data.data);
}

export async function deleteAnswer(answerId) {
  return axios.delete(`/answers/${answerId}`).then((data) => data.data);
}

export async function deleteReportedAnswer(reportId) {
  return axios.delete(`/reports/answers/${reportId}`).then((data) => data.data);
}
