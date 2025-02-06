import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
//MUI
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

import MUIRichTextEditor from "mui-rte";
import { EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";

import { addQuestion } from "../redux/actions/questionActions";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  title: {
    width: "100%",
    marginBottom: "5px",
  },
  rte: {
    minHeight: "150px",
    padding: "10px",
  },
  btn: {
    marginTop: "5px",
  },
}));

function PostQuestionForm() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const selectedExamPaper = useSelector((state) => state.questions.selectedExamPaper);
  const loading = useSelector((state) => state.questions.loadingQuestionSubmit);
  const error = useSelector((state) => state.questions.questionSubmitError);
  const user = useSelector((state) => state.user.user);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  const onSubmit = () => {
    const options = {
      entityStyleFn: (entity) => {
        const entityType = entity.get("type").toLowerCase();
        if (entityType === "image") {
          const data = entity.getData();

          return {
            element: "img",
            attributes: {
              src: data.url,
            },
            style: {
              width: data.width,
              height: data.height,
              maxWidth: "100%",
            },
          };
        }
      },
    };
    const html = stateToHTML(editorState.getCurrentContent(), options);
    dispatch(addQuestion(user.id, title, html, selectedExamPaper.id));
    setTitle("");
    setEditorState(() => EditorState.createEmpty());
  };

  const onTitleChange = (ev) => {
    setTitle(ev.target.value);
  };

  return (
    <div>
      {loading ? (
        <CircularProgress />
      ) : (
        <div className={classes.container}>
          <TextField label="Title" variant="outlined" className={classes.title} onChange={onTitleChange} />
          <Paper className={classes.rte}>
            <MUIRichTextEditor
              controls={[
                "title",
                "bold",
                "italic",
                "underline",
                "strikethrough",
                "undo",
                "redo",
                "media",
                "numberList",
                "bulletList",
                "quote",
                "clear",
              ]}
              label="Postavite pitanje"
              inlineToolbar={true}
              editorState={editorState}
              onChange={setEditorState}
            />
          </Paper>
          <Button className={classes.btn} variant="contained" color="primary" onClick={onSubmit}>
            Postavi pitanje
          </Button>
        </div>
      )}
      <Typography color="error">{error}</Typography>
    </div>
  );
}

export default PostQuestionForm;
