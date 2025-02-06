import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import books from "../assets/landing/books.png";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  container: {
    marginTop: "0",
    position: "relative",
    width: "100%",
  },
  img: {
    width: "relative",
    height: "80vw",
  },
  btnContainer: {
    height: "relative",
    width: "30vw",
    maxWidth: "400px",
    minWidth: "200px",
    position: "absolute",
    top: "45%",
    left: "50%",
    transform: "translate(-50%, 50%)",
    msTransform: "translate(-50%, -50%)",
    color: "white",
    fontSize: "16px",
    padding: "12px 24px",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "space-around",
  },
}));

const Wrapper = () => {
  const classes = useStyles();
  const history = useHistory();

  const authenticated = useSelector((state) => state.user.authenticated);

  const handleClick = () => {
    history.push("/browse_exam_papers");
  };

  const handlePostExamPaper = () => {
    history.push("/post_exam_paper_form");
  };

  return (
    <div className={classes.container}>
      <div className={classes.btnContainer}>
        <Button onClick={handleClick} variant="contained" color="primary">
          Idi na blankete
        </Button>
        {authenticated && (
          <Button onClick={handlePostExamPaper} variant="contained" color="secondary">
            Postavi blanket
          </Button>
        )}
      </div>

      <img src={books} alt="img" width="100%" height="100vh" className={classes.img} />
    </div>
  );
};
function landing() {
  return <Wrapper />;
}
export default landing;
