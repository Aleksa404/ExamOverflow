import {
  LOAD_QUESTIONS,
  LOAD_QUESTIONS_SUCCESSFUL,
  LOAD_QUESTIONS_FAILURE,
  CLEAR_QUESTIONS,
  ADD_QUESTION,
  ADD_QUESTION_SUCCESSFUL,
  ADD_QUESTION_FAILURE,
  LOAD_EXAM_PAPER,
  LOAD_EXAM_PAPER_SUCCESSFUL,
  LOAD_EXAM_PAPER_FAILURE,
} from "../types";

const initialState = {
  questions: [],
  loadingQuestions: false,
  questionsError: "",
  loadingQuestionSubmit: false,
  questionSubmitError: "",
  selectedExamPaper: undefined,
  loadingSelectedExamPaper: false,
  selectedExamPaperError: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOAD_QUESTIONS:
      return {
        ...state,
        loadingQuestions: true,
        loadingSelectedExamPaper: true,
      };
    case LOAD_QUESTIONS_SUCCESSFUL:
      return {
        ...state,
        loadingQuestions: false,
        questions: action.payload,
        questionsError: "",
      };
    case LOAD_QUESTIONS_FAILURE:
      return {
        ...state,
        loadingQuestions: false,
        questions: [],
        questionsError: action.payload,
      };
    case LOAD_EXAM_PAPER:
      return {
        ...state,
        loadingSelectedExamPaper: true,
      };
    case LOAD_EXAM_PAPER_SUCCESSFUL:
      return {
        ...state,
        loadingSelectedExamPaper: false,
        selectedExamPaper: action.payload,
        selectedExamPaperError: "",
      };
    case LOAD_EXAM_PAPER_FAILURE:
      return {
        ...state,
        loadingSelectedExamPaper: false,
        selectedExamPaper: undefined,
        selectedExamPaperError: action.payload,
      };
    case ADD_QUESTION:
      return {
        ...state,
        loadingQuestionSubmit: true,
      };
    case ADD_QUESTION_SUCCESSFUL:
      return {
        ...state,
        questions: [...state.questions, action.payload],
        loadingQuestionSubmit: false,
        questionSubmitError: "",
      };
    case ADD_QUESTION_FAILURE:
      return {
        ...state,
        loadingQuestionSubmit: false,
        questionSubmitError: action.payload,
      };
    case CLEAR_QUESTIONS:
      return {
        ...state,
        questions: [],
      };
    default:
      return state;
  }
}
