import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import MUIRichTextEditor from "mui-rte";
import { EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";

import { addAnswer } from "../redux/actions/answersActions";

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

function PostAnswerForm() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selectedQuestion = useSelector(
    (state) => state.answers.selectedQuestion
  );
  const loading = useSelector((state) => state.answers.loadingAnswersSubmit);
  const error = useSelector((state) => state.answers.answersSubmitError);
  const user = useSelector((state) => state.user.user);

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    return () => {};
  }, []);

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
            },
          };
        }
      },
    };
    const html = stateToHTML(editorState.getCurrentContent(), options);
    dispatch(addAnswer(user.id, html, selectedQuestion));
    setEditorState(() => EditorState.createEmpty());
  };

  return (
    <div>
      {loading ? (
        <CircularProgress />
      ) : (
        <div className={classes.container}>
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
              label="Postavite odgovor"
              inlineToolbar={true}
              editorState={editorState}
              onChange={setEditorState}
            />
          </Paper>
          <Button
            className={classes.btn}
            variant="contained"
            color="primary"
            onClick={onSubmit}
          >
            Postavi odgovor
          </Button>
        </div>
      )}
      <Typography color="error">{error}</Typography>
    </div>
  );
}
export default PostAnswerForm;
