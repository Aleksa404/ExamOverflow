import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { validateEmail } from "../service/util";

//MUI stuff
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

import axios from "axios";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function RegisterForm() {
  const classes = useStyles();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [serverErrors, setServerErrors] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [submit, setSubmit] = useState(false);
  //Redux stuff

  useEffect(() => {
    if (submit) handleRegister();
    return () => {};
  }, [submit]);

  const history = useHistory();

  const handleInput = (e) => {
    if (e.target.name === "email") setEmail(e.target.value);
    else if (e.target.name === "password") setPassword(e.target.value);
    else if (e.target.name === "confirmPassword") setConfirmPassword(e.target.value);
    else if (e.target.name === "userName") setUserName(e.target.value);
  };

  const handleUserNameValidation = () => {
    const usernameField = document.querySelector("#username");
    if (usernameField.value) setUserNameError("");
    else setUserNameError("Ovo polje ne sme biti prazno");
  };
  const handleEmailValidation = () => {
    const emailField = document.querySelector("#email");
    if (emailField.value && validateEmail(emailField.value)) setEmailError("");
    else setEmailError("Ovo polje mora da sadrži validnu email adresu");
  };
  const handlePasswordValidation = () => {
    const passwordField = document.querySelector("#password");
    if (passwordField.value) setPasswordError("");
    else setPasswordError("Ovo polje ne sme biti prazno");
  };
  const handleConfirmPassword = () => {
    const passwordField = document.querySelector("#password");
    const confirmPasswordField = document.querySelector("#confirm-password");
    if (!confirmPasswordField.value) setConfirmPasswordError("Ovo polje ne sme biti prazno");
    else if (confirmPasswordField.value !== passwordField.value) setConfirmPasswordError("Šifre nisu iste");
    else setConfirmPasswordError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUserNameValidation();
    handleEmailValidation();
    handlePasswordValidation();
    handleConfirmPassword();
    setSubmit(true);
  };

  const handleRegister = async () => {
    if (userNameError === "" && emailError === "" && passwordError === "" && confirmPasswordError === "") {
      setLoading(true);
      await register(userName, email, password, confirmPassword);
    }
  };

  async function register(userName, email, password, confirmPassword) {
    axios
      .post("/register", { userName, email, password, confirmPassword })
      .then((res) => {
        setLoading(false);
        history.push("/");
      })
      .catch((err) => {
        if (err.response != null) setServerErrors(err.response.data.map((el) => el.description));
        else setServerErrors(["Something went wrong"]);
        setLoading(false);
        setSubmit(false);
      });
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <form className={classes.form} noValidate method="post">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="username"
                label="User Name"
                name="userName"
                error={userNameError !== ""}
                helperText={userNameError}
                onChange={handleInput}
                onBlur={handleUserNameValidation}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                error={emailError !== ""}
                helperText={emailError}
                onChange={handleInput}
                onBlur={handleEmailValidation}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                error={passwordError !== ""}
                helperText={passwordError}
                onChange={handleInput}
                onBlur={handlePasswordValidation}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="confirm-password"
                name="confirmPassword"
                label="Confirm password"
                type="password"
                error={confirmPasswordError !== ""}
                helperText={confirmPasswordError}
                onChange={handleInput}
                onBlur={handleConfirmPassword}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
          >
            {isLoading ? <CircularProgress color="secondary" /> : <span>Register</span>}
          </Button>
          <Grid container justify="flex-end">
            {serverErrors.map((err, index) => (
              <Grid item key={index}>
                <Typography key={index} color="error">
                  {err}
                </Typography>
              </Grid>
            ))}
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
export default RegisterForm;
