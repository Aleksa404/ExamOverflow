import React from "react";
//Mui stuff
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
//Router stuff
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  copy: {
    marginTop: "calc(5% + 60px)",
    backgroundColor: "rgb(63,81,181)",
    color: "white",
    textAlign: "center",
    padding: "3rem",
  },
  link: {
    cursor: "pointer",
  },
}));

function Copyright() {
  //Mui stuff
  const classes = useStyles();

  //Router stuff
  const history = useHistory();

  return (
    <footer className={classes.copy}>
      <Typography variant="body2" align="center">
        {"Copyright © "}
        <Link className={classes.link} color="inherit" onClick={() => history.push("/")}>
          Exam Overflow
        </Link>{" "}
        {new Date().getFullYear()}
      </Typography>
    </footer>
  );
}

export default Copyright;
