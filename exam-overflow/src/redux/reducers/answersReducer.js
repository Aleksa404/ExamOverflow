import {
  LOAD_ANSWERS,
  LOAD_ANSWERS_FAILURE,
  LOAD_ANSWERS_SUCCESSFUL,
  CLEAR_ANSWERS,
  ADD_ANSWER,
  ADD_ANSWER_FAILURE,
  ADD_ANSWER_SUCCESSFUL,
  LOAD_SELECTED_QUESTION_SUCCESSFUL,
  LOAD_SELECTED_QUESTION_FAILURE,
  LOAD_SELECTED_EXAM_PAPER_SUCCESSFUL,
  LOAD_SELECTED_EXAM_PAPER_FAILURE,
} from "../types";

const initialState = {
  answers: [],
  loadingAnwers: false,
  anwersError: "",
  selectedQuestion: undefined,
  loadingSelectedQuestion: false,
  selectedQuestionError: undefined,
  selectedExamPaper: undefined,
  loadingSelectedExamPaper: false,
  selectedExamPaperError: undefined,

  loadingAnwerSubmit: false,
  anwerSubmitError: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOAD_ANSWERS:
      return {
        ...state,
        loadingAnwers: true,
        loadingSelectedQuestion: true,
        loadingSelectedExamPaper: true,
      };
    case LOAD_SELECTED_EXAM_PAPER_SUCCESSFUL:
      return {
        ...state,
        loadingSelectedExamPaper: false,
        selectedExamPaperError: undefined,
        selectedExamPaper: action.payload,
      };
    case LOAD_SELECTED_EXAM_PAPER_FAILURE:
      return {
        ...state,
        loadingSelectedExamPaper: false,
        selectedExamPaperError: action.payload,
        selectedExamPaper: undefined,
      };
    case LOAD_SELECTED_QUESTION_SUCCESSFUL:
      return {
        ...state,
        loadingSelectedQuestion: false,
        selectedQuestionError: undefined,
        selectedQuestion: action.payload,
      };
    case LOAD_SELECTED_QUESTION_FAILURE:
      return {
        ...state,
        loadingSelectedQuestion: false,
        selectedQuestionError: action.payload,
        selectedQuestion: undefined,
      };
    case LOAD_ANSWERS_SUCCESSFUL:
      return {
        ...state,
        loadingAnwers: false,
        answers: action.payload,
        answersError: "",
      };
    case LOAD_ANSWERS_FAILURE:
      return {
        ...state,
        loadingAnwers: false,
        answers: [],
        answersError: action.payload,
      };
    case ADD_ANSWER:
      return {
        ...state,
        loadingAnswerSubmit: true,
      };
    case ADD_ANSWER_SUCCESSFUL:
      return {
        ...state,
        answers: [...state.answers, action.payload],
        loadingAnswerSubmit: false,
        answerSubmitError: "",
      };
    case ADD_ANSWER_FAILURE:
      return {
        ...state,
        loadingAnwerSubmit: false,
        answerSubmitError: action.payload,
      };
    case CLEAR_ANSWERS:
      return {
        ...state,
        answers: [],
        selectedQuestion: undefined,
        selectedExamPaper: undefined,
      };
    default:
      return state;
  }
}
