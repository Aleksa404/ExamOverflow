import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { loadQuestions, selectExamPaper } from "../redux/actions/questionActions";
import Question from "./Question";
import ExamPaper from "./ExamPaper";
import PostQuestionForm from "./PostQuestionForm";
//MUI stuff
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

function Questions() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const questions = useSelector((state) => state.questions.questions);
  const loadingQuestions = useSelector((state) => state.questions.loadingQuestions);
  const selectedExamPaper = useSelector((state) => state.questions.selectedExamPaper);
  const authenticated = useSelector((state) => state.user.authenticated);

  useEffect(() => {
    dispatch(loadQuestions(id));
    dispatch(selectExamPaper(id));
    return () => {};
  }, []);

  return (
    <Container>
      <ExamPaper examPaper={selectedExamPaper} />
      {loadingQuestions && <CircularProgress />}
      {questions && questions.map((question) => <Question key={question.id} question={question} like={true} />)}
      {authenticated ? (
        <PostQuestionForm />
      ) : (
        <Typography color="secondary" variant="h5" align="center">
          Potrebno je da se prijavite da bi postavili pitanje
        </Typography>
      )}
    </Container>
  );
}

export default Questions;
