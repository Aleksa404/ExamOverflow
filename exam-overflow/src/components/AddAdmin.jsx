import React from "react";
import { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import { addAdmin, removeAdmin, getUserByEmail } from "../service/userService";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  button: {
    margin: theme.spacing(1),
    top: "15px",
  },
  Link: {
    margin: theme.spacing(2),
    top: "60px",
    fontSize: "150%",
  },
  message: {
    marginTop: "20px",
  },
}));

function AddAdmin() {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [type, setType] = useState("add");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailChange = (ev) => {
    setEmail(ev.target.value);
  };

  const handleTypeChange = (ev) => {
    setType(ev.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    getUserByEmail(email)
      .then((user) => {
        if (type === "add") {
          addAdmin(user.email)
            .then((res) => {
              setMessage(`Korisnik sa email adresom ${email} je postao admin`);
              setError("");
              setEmailError("");
              setLoading(false);
            })
            .catch((err) => {
              setMessage("");
              setError("Korisnik je već admin");
              setEmailError("");
              setLoading(false);
            });
        } else {
          removeAdmin(user.email)
            .then((res) => {
              setMessage(`Korisnik sa email adresom ${email} nije više admin`);
              setError("");
              setEmailError("");
              setLoading(false);
            })
            .catch((err) => {
              setMessage("");
              setError("Korisnik nije admin");
              setEmailError("");
              setLoading(false);
            });
        }
      })
      .catch((err) => {
        setMessage("");
        setError(err.value);
        setEmailError("Nepostojeći korisnik");
        setLoading(false);
      });
  };

  return (
    <form>
      <div className={classes.container}>
        <h3>Upišite email korisnika kome želite da ažurirate ulogu</h3>
        <TextField
          id="standard-basic"
          label="Email korisnika"
          value={email}
          onChange={handleEmailChange}
          error={emailError !== ""}
          helperText={emailError}
        />
        <RadioGroup defaultValue="add" onChange={handleTypeChange}>
          <FormControlLabel value="add" control={<Radio />} label="Dodaj status admina" />
          <FormControlLabel value="remove" control={<Radio />} label="Skini status admina" />
        </RadioGroup>
        <Button onClick={handleSubmit} variant="contained" color="primary" className={classes.button}>
          Ažuriraj status
        </Button>
        <Typography className={classes.message}>{message}</Typography>
        <Typography color="error">{error}</Typography>
        {loading && <CircularProgress className={classes.loading} />}
      </div>
    </form>
  );
}
export default AddAdmin;
