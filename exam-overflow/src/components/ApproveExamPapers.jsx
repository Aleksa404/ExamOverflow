import React from "react";
import { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

import { getUnapprovedExamPapers, deleteExampaper, approveExamPaper } from "../service/examPapersService";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "700px",
    margin: "200px auto 0 auto",
    backgroundColor: "#eee",
    padding: "20px",
  },
  link: {
    cursor: "pointer",
    textAlign: "center",
    "&:hover": {
      background: "#dcdcdc",
      borderRadius: "10px",
    },
  },
  btn: {
    marginLeft: "5px",
  },
}));

function ApproveExamPapers() {
  const classes = useStyles();
  const [examPapers, setExamPapers] = useState([]);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getUnapprovedExamPapers().then((examPapers) => {
      setExamPapers(examPapers);
    });
    return () => {};
  }, []);

  const handleLink = (documentUrl) => {
    window.open(documentUrl, "_blank");
  };

  const handleApprove = (ev, id) => {
    setLoading(true);
    approveExamPaper(id)
      .then((examPaper) => {
        const list = examPapers.filter((ep) => ep.id !== id);
        setExamPapers(list);
        setLoading(false);
        setError("");
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleDelete = (ev, id) => {
    setLoading(true);
    deleteExampaper(id)
      .then((examPaper) => {
        const list = examPapers.filter((ep) => ep.id !== id);
        setExamPapers(list);
        setLoading(false);
        setError("");
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <List className={classes.root}>
      {loading && <CircularProgress />}
      <Typography color="error">{error}</Typography>
      {examPapers.length === 0 && <div>Ne postoje neodobreni blanketi</div>}
      {examPapers &&
        examPapers.map((examPaper) => (
          <React.Fragment key={examPaper.id}>
            <ListItem>
              <ListItemAvatar className={classes.link}>
                <Avatar
                  className={classes.img}
                  alt="Remy Sharp"
                  src={examPaper.documentUrl}
                  onClick={() => handleLink(examPaper.documentUrl)}
                />
              </ListItemAvatar>
              <ListItemText
                primary={`${examPaper.course.name}, ${examPaper.year} ${examPaper.term}-ski, ${examPaper.type}`}
              />
              <Button
                className={classes.btn}
                onClick={(ev) => handleApprove(ev, examPaper.id)}
                variant="contained"
                color="primary"
              >
                Odobri
              </Button>
              <Button
                className={classes.btn}
                onClick={(ev) => handleDelete(ev, examPaper.id)}
                variant="contained"
                color="secondary"
              >
                Obriši
              </Button>
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
    </List>
  );
}

export default ApproveExamPapers;
