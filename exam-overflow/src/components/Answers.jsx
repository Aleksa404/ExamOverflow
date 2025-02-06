import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { loadAnswers } from "../redux/actions/answersActions";

import Answer from "./Answer";
import ExamPaper from "./ExamPaper";
import PostAnswerForm from "./PostAnswerForm";
import Question from "./Question";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { CLEAR_ANSWERS } from "../redux/types";

export default function Answers() {
  const { id } = useParams();
  const question = useSelector((state) => state.answers.selectedQuestion);
  const loadingQuestion = useSelector((state) => state.answers.loadingSelectedQuestion);
  const selectedQuestionError = useSelector((state) => state.answers.selectedQuestionError);
  const examPaper = useSelector((state) => state.answers.selectedExamPaper);
  const loadingExamPaper = useSelector((state) => state.answers.loadingSelectedExamPaper);
  const examPaperError = useSelector((state) => state.answers.selectedExamPaperError);
  const answers = useSelector((state) => state.answers.answers);
  const loadingAnswers = useSelector((state) => state.answers.loadingAnswers);
  const answersError = useSelector((state) => state.answers.answersError);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadAnswers(id));
    return () => {
      dispatch({ type: CLEAR_ANSWERS });
    };
  }, []);

  return (
    <div>
      <Typography color="error">{examPaperError}</Typography>
      {loadingExamPaper && <CircularProgress />}
      <ExamPaper examPaper={examPaper} />
      <Typography color="error">{selectedQuestionError}</Typography>
      {loadingQuestion && <CircularProgress />}
      {question && (
        <div>
          <h1>Pitanje :</h1> <Question question={question} like={false} />
        </div>
      )}
      <Typography color="error">{answersError}</Typography>
      {loadingAnswers && <CircularProgress />}
      <h1>Odgovori:</h1>
      {answers && answers.map((answer) => <Answer key={answer.id} answer={answer} like={true} />)}
      <PostAnswerForm />
    </div>
  );
}
