import {
  LOAD_QUESTIONS,
  LOAD_QUESTIONS_SUCCESSFUL,
  LOAD_QUESTIONS_FAILURE,
  ADD_QUESTION,
  ADD_QUESTION_SUCCESSFUL,
  ADD_QUESTION_FAILURE,
  LOAD_EXAM_PAPER,
  LOAD_EXAM_PAPER_SUCCESSFUL,
  LOAD_EXAM_PAPER_FAILURE,
} from "../types";

import { getQuestions, postQuestion } from "../../service/questionsService";
import { getExamPaper } from "../../service/examPapersService";

export const loadQuestions = (examPaperId) => (dispatch) => {
  dispatch({ type: LOAD_QUESTIONS });
  getExamPaper(examPaperId)
    .then((examPaper) => {
      dispatch({ type: LOAD_EXAM_PAPER_SUCCESSFUL, payload: examPaper });
      getQuestions(examPaperId)
        .then((questions) => {
          dispatch({ type: LOAD_QUESTIONS_SUCCESSFUL, payload: questions });
        })
        .catch((err) => {
          dispatch({ type: LOAD_QUESTIONS_FAILURE, payload: "Pitanja nisu pronađena " + err.message });
        });
    })
    .catch((err) => {
      dispatch({ type: LOAD_EXAM_PAPER_FAILURE, payload: "Blanket nije pronađen " + err.message });
    });
};

export const addQuestion = (userId, title, content, examPaperId) => (dispatch) => {
  if (!title || !content) {
    dispatch({ type: ADD_QUESTION_FAILURE, payload: "Sva polja su obavezna" });
    return;
  }
  dispatch({ type: ADD_QUESTION });
  postQuestion(userId, title, content, examPaperId)
    .then((res) => dispatch({ type: ADD_QUESTION_SUCCESSFUL, payload: res }))
    .catch((err) => dispatch({ type: ADD_QUESTION_FAILURE, payload: err.message }));
};

export const selectExamPaper = (examPaperId) => (dispatch) => {
  dispatch({ type: LOAD_EXAM_PAPER });
  getExamPaper(examPaperId)
    .then((examPaper) => dispatch({ type: LOAD_EXAM_PAPER_SUCCESSFUL, payload: examPaper }))
    .catch((err) => dispatch({ type: LOAD_EXAM_PAPER_FAILURE, payload: err.message }));
};
