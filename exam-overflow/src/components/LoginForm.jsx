import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

//MUI stuff
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

//Redux stuff

import { validateEmail } from "../service/util";
import { loginUser } from "../redux/actions/userActions";

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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  buttonWrapper: {
    display: "flex",
    flexDirection: "row",
  },
  button: {
    marginLeft: "-12%",
    backgroundColor: "transparent",
  },
  input: {
    backgroundColor: "transparent",
    //border: 2px solid black;
  },
}));

function LoginForm() {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submit, setSubmit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  //Redux stuff
  const isLoading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);
  const authenticated = useSelector((state) => state.user.authenticated);
  const dispatch = useDispatch();
  //Reouter stuff
  const history = useHistory();

  useEffect(() => {
    if (submit) handleLogin();
    if (authenticated) history.push("/");
    return () => {};
  }, [submit, authenticated]);

  const handleInput = (e) => {
    if (e.target.name === "email") setEmail(e.target.value);
    else if (e.target.name === "password") setPassword(e.target.value);
  };

  const handleEmailValidation = () => {
    const emailField = document.querySelector("#email");
    if (emailField.value && validateEmail(emailField.value)) setEmailError("");
    else setEmailError("Email nije validan");
  };

  const handlePasswordValidation = () => {
    const passwordField = document.querySelector("#password");
    if (passwordField.value) setPasswordError("");
    else setPasswordError("Polje za šifru ne sme biti prazno");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEmailValidation();
    handlePasswordValidation();
    setSubmit(true);
  };

  const handleLogin = () => {
    if (emailError === "" && passwordError === "") {
      dispatch(loginUser(email, password));
    }
    setSubmit(false);
  };
  const handleClickShowPassword = () => {
    if (showPassword === false) {
      setShowPassword(true);
    } else setShowPassword(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}></Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate method="post">
          <TextField
            variant="outlined"
            margin="normal"
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
          <div className={classes.buttonWrapper}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="password"
              name="password"
              label="Password"
              autoComplete="current-password"
              error={passwordError !== ""}
              helperText={passwordError}
              onChange={handleInput}
              onBlur={handlePasswordValidation}
              // type="password"

              type={showPassword ? "text" : "password"}
            />
            <IconButton
              aria-label="toggle password visibility"
              dge="end"
              className={classes.button}
              onClick={handleClickShowPassword}
            >
              {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </div>
          {/* <Grid item xs={12}>
              <FormControl
                className={clsx(
                  classes.margin,
                  classes.withoutLabel,
                  classes.textField
                )}
              >
                <InputLabel htmlFor="outlined-adornment-password" fullWidth>
                  Password*
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  variant="outlined"
                  required
                  fullWidth
                  name="Password"
                  label="Password"
                  autoComplete="current-password"
                  error={passwordError !== ""}
                  helperText={passwordError}
                  onChange={handleInput}
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        //onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  labelWidth={70}
                />
              </FormControl> */}

          <Typography color="error">{error}</Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <CircularProgress color="secondary" />
            ) : (
              <span>Login</span>
            )}
          </Button>
          <Grid container>
            <Grid item xs></Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

export default LoginForm;
