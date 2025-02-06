import { LOAD_EXAM_PAPERS, LOAD_EXAM_PAPERS_SUCCESSFUL, LOAD_EXAM_PAPERS_FAILURE } from "../types";
import { getExamPapers } from "../../service/examPapersService";

export const loadExamPapers = (courseId) => (dispatch) => {
  dispatch({ type: LOAD_EXAM_PAPERS });
  getExamPapers(courseId)
    .then((examPapers) => {
      dispatch({ type: LOAD_EXAM_PAPERS_SUCCESSFUL, payload: examPapers });
    })
    .catch((err) => dispatch({ type: LOAD_EXAM_PAPERS_FAILURE, payload: err.message }));
};
