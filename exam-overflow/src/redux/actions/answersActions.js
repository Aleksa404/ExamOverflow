import {
  LOAD_ANSWERS,
  LOAD_ANSWERS_SUCCESSFUL,
  LOAD_ANSWERS_FAILURE,
  ADD_ANSWER_SUCCESSFUL,
  ADD_ANSWER,
  ADD_ANSWER_FAILURE,
  LOAD_SELECTED_QUESTION_SUCCESSFUL,
  LOAD_SELECTED_QUESTION_FAILURE,
  LOAD_SELECTED_EXAM_PAPER_SUCCESSFUL,
  LOAD_SELECTED_EXAM_PAPER_FAILURE,
} from "../types";

import { getAnswers, postAnswer } from "../../service/answersService";
import { getQuestion } from "../../service/questionsService";
import { getExamPaper } from "../../service/examPapersService";

export const loadAnswers = (questionId) => (dispatch) => {
  dispatch({ type: LOAD_ANSWERS });
  getQuestion(questionId)
    .then((question) => {
      dispatch({ type: LOAD_SELECTED_QUESTION_SUCCESSFUL, payload: question });
      getExamPaper(question.examPaperId)
        .then((examPaper) => {
          dispatch({ type: LOAD_SELECTED_EXAM_PAPER_SUCCESSFUL, payload: examPaper });
          getAnswers(questionId)
            .then((answers) => {
              dispatch({ type: LOAD_ANSWERS_SUCCESSFUL, payload: answers });
            })
            .catch((err) => {
              dispatch({ type: LOAD_ANSWERS_FAILURE, payload: "Odgovori nisu nađeni " + err.message });
            });
        })
        .catch((err) => {
          dispatch({ type: LOAD_SELECTED_EXAM_PAPER_FAILURE, payload: "Blanket nije nađen " + err.message });
        });
    })
    .catch((err) => {
      dispatch({ type: LOAD_SELECTED_QUESTION_FAILURE, payload: "Pitanje nije nađeno pitanje " + err.message });
    });
};

export const addAnswer = (userID, content, question) => (dispatch) => {
  if (!content) {
    dispatch({ type: ADD_ANSWER_FAILURE, payload: "Sva polja su obavezna" });
    return;
  }
  dispatch({ type: ADD_ANSWER });
  postAnswer(userID, content, question)
    .then((res) => dispatch({ type: ADD_ANSWER_SUCCESSFUL, payload: res }))
    .catch((err) => dispatch({ type: ADD_ANSWER_FAILURE, payload: err.message }));
};
