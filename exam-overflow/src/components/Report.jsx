import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { TextField, CircularProgress } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import ReportIcon from "@material-ui/icons/Report";
import { createMuiTheme } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import { ThemeProvider } from "@material-ui/styles";
import { reportQuestion } from "../service/questionsService";
import { reportAnswer } from "../service/answersService";

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
  Razlog: {
    position: "relative",
    left: "0px",
    marginBottom: "20px",
  },
  palette: {
    primary: {
      main: "#81d4fa",
    },
    secondary: {
      main: "#e53935",
    },
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#81d4fa",
    },
    secondary: {
      main: red[900],
    },
  },
});

function Report(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const type = props.type;
  const postId = props.postId;
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  const handleReasonChange = (ev) => {
    setReason(ev.target.value);
  };

  const handleReport = (ev) => {
    setLoading(true);
    if (!reason) {
      setError("Upiši razlog");
      setLoading(false);
      return;
    }
    if (type === "question") {
      reportQuestion(postId, reason)
        .then((report) => {
          setLoading(false);
          handleClose();
          alert("Pitanje uspešno reportovano");
        })
        .catch((err) => {
          setLoading(false);
          setError("Neuspešan report");
        });
    } else if (type === "answer") {
      reportAnswer(postId, reason)
        .then((report) => {
          setLoading(false);
          handleClose();
          alert("Odgovor uspešno reportovan");
        })
        .catch((err) => {
          setLoading(false);
          setError("Neuspešan report");
        });
    }
    setLoading(false);
  };

  return (
    <div>
      <IconButton title="Reportuj korisnika" onClick={handleClick}>
        <ThemeProvider theme={theme}>
          <ReportIcon color="secondary" />
        </ThemeProvider>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {loading && <CircularProgress />}
        <Typography color="error">{error}</Typography>
        <Typography className={classes.typography}>
          Unesite razlog prijave korisnika
        </Typography>
        <TextField
          onChange={handleReasonChange}
          id="standard-basic"
          multiline
          label="Razlog"
          className={classes.Razlog}
        />
        <ThemeProvider theme={theme}>
          <Button
            value={reason}
            onClick={handleReport}
            color="secondary"
            variant="contained"
          >
            Report
          </Button>
        </ThemeProvider>
      </Popover>
    </div>
  );
}
export default Report;
