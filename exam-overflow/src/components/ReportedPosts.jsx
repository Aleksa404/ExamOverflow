import React from "react";
import { useState, useEffect } from "react";

import Question from "./Question";
import Answer from "./Answer";

import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import BlockIcon from "@material-ui/icons/Block";
import CloseIcon from "@material-ui/icons/Close";
import { getReportedQuestions, deleteQuestion, deleteReportedQuestion } from "../service/questionsService";
import { getReportedAnswers, deleteAnswer, deleteReportedAnswer } from "../service/answersService";
import { banUser } from "../service/userService";

const useStyles = makeStyles((theme) => ({
  reportReason: {
    backgroundColor: "#fff59d",
    marginLeft: "5vw",
    marginRight: "5vw",
  },
  button: {
    position: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginLeft: "5vw",
    marginRight: "5vw",
  },
  post: {
    backgroundColor: "#ffeb3b",
  },
  forma: {
    marginTop: "10vw",
  },
  heding: {
    position: "center",
    display: "flex",
    justifyContent: "center",
  },
}));

function ReportedPosts() {
  const classes = useStyles();
  const [questionReports, setQuestionReports] = useState("");
  const [answerReports, setAnswerReports] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getReportedQuestions().then((questionReports) => {
      setQuestionReports(questionReports);
    });
    getReportedAnswers().then((answerReports) => {
      setAnswerReports(answerReports);
    });
    return () => {};
  }, []);

  const handleDeleteQuestion = (questionId) => {
    setLoading(true);
    deleteQuestion(questionId)
      .then((questionReport) => {
        const qs = questionReports.filter((quRep) => quRep.questionId !== questionId);
        setQuestionReports(qs);
        setLoading(false);
        setError("");
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  const handleBanUserWithQuestion = (userId, questionId) => {
    deleteQuestion(questionId)
      .then((questionReport) => {
        const qs = questionReports.filter((quRep) => quRep.questionId !== questionId);
        setQuestionReports(qs);
      })
      .then(() => {
        banUser(userId)
          .then((user) => {
            setLoading(false);
            setError("");
            alert(`Korisnik ${user.username} je banovan`);
          })
          .catch((err) => {
            setLoading(false);
            setError(err.message);
          });
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  const handleDeleteQuestionReport = (questionReportId) => {
    setLoading(true);
    deleteReportedQuestion(questionReportId)
      .then((questionReport) => {
        const qs = questionReports.filter((quRep) => quRep.id !== questionReportId);
        setQuestionReports(qs);
        setLoading(false);
        setError("");
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  const handleDeleteAnswer = (answerId) => {
    setLoading(true);
    deleteAnswer(answerId)
      .then((answerReport) => {
        const as = answerReports.filter((aRep) => aRep.answerId !== answerId);
        setAnswerReports(as);
        setLoading(false);
        setError("");
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  const handleBanUserWithAnswer = (userId, answerId) => {
    deleteAnswer(answerId)
      .then((answerReport) => {
        const as = answerReports.filter((aRep) => aRep.answerId !== answerId);
        setAnswerReports(as);
      })
      .then(() => {
        banUser(userId)
          .then((user) => {
            setLoading(false);
            setError("");
            alert(`Korisnik ${user.username} je banovan`);
          })
          .catch((err) => {
            setLoading(false);
            setError(err.message);
          });
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  const handleDeleteAnswerReport = (answerReportId) => {
    setLoading(true);
    deleteReportedAnswer(answerReportId)
      .then((answerReport) => {
        const as = answerReports.filter((aRep) => aRep.id !== answerReportId);
        setAnswerReports(as);
        setLoading(false);
        setError("");
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  return (
    <div className={classes.forma}>
      <h1 className={classes.heding}>Reportovani postovi</h1>
      <Typography color="error">{error}</Typography>
      {loading && <CircularProgress />}
      {questionReports &&
        questionReports.map((questionReport) => (
          <div key={questionReport.id}>
            <Question question={questionReport.question} like={false} />
            <Typography className={classes.reportReason} variant="h5">
              Razlog: {questionReport.content}
            </Typography>
            <div className={classes.button}>
              <Button
                onClick={(ev) => handleDeleteQuestion(questionReport.question.id)}
                variant="contained"
                className={classes.post}
                startIcon={<DeleteIcon />}
              >
                Obrisi post
              </Button>
              <Button
                onClick={(ev) => handleBanUserWithQuestion(questionReport.question.userID, questionReport.question.id)}
                variant="contained"
                color="secondary"
                // className={classes.ban}
                startIcon={<BlockIcon />}
              >
                Banuj korisnika
              </Button>
              <Button
                onClick={(ev) => handleDeleteQuestionReport(questionReport.id)}
                variant="contained"
                color="primary"
                // className={classes.ban}
                startIcon={<CloseIcon />}
              >
                Obrisi report
              </Button>
            </div>
          </div>
        ))}

      {answerReports &&
        answerReports.map((answerReport) => (
          <div key={answerReport.id}>
            <Answer answer={answerReport.answer} like={false} />
            <Typography className={classes.reportReason} variant="h5">
              Razlog: {answerReport.content}
            </Typography>
            <div className={classes.button}>
              <Button
                onClick={(ev) => handleDeleteAnswer(answerReport.answer.id)}
                variant="contained"
                className={classes.post}
                startIcon={<DeleteIcon />}
              >
                Obrisi post
              </Button>
              <Button
                onClick={(ev) => handleBanUserWithAnswer(answerReport.answer.userID, answerReport.answer.id)}
                variant="contained"
                color="secondary"
                // className={classes.ban}
                startIcon={<BlockIcon />}
              >
                Banuj korisnika
              </Button>
              <Button
                onClick={(ev) => handleDeleteAnswerReport(answerReport.id)}
                variant="contained"
                color="primary"
                // className={classes.ban}
                startIcon={<CloseIcon />}
              >
                Obrisi report
              </Button>
            </div>
          </div>
        ))}
    </div>
  );
}

export default ReportedPosts;
