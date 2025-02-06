import { LOAD_EXAM_PAPERS, LOAD_EXAM_PAPERS_SUCCESSFUL, LOAD_EXAM_PAPERS_FAILURE, CLEAR_EXAM_PAPERS } from "../types";

const initialState = {
  examPapers: [],
  loadingExamPapers: false,
  examPapersError: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOAD_EXAM_PAPERS:
      return { ...state, loadingExamPapers: true };
    case LOAD_EXAM_PAPERS_SUCCESSFUL:
      return { ...state, loadingExamPapers: false, examPapers: action.payload, examPapersError: "" };
    case LOAD_EXAM_PAPERS_FAILURE:
      return { ...state, loadingExamPapers: false, examPapers: [], examPapersError: action.payload };
    case CLEAR_EXAM_PAPERS:
      return { ...state, examPapers: [], loadingExamPapers: false };
    default:
      return state;
  }
}
