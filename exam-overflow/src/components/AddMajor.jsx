import React from "react";
import { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import PublishIcon from "@material-ui/icons/Publish";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

import { postMajor } from "../service/majorsService";

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
}));

function AddMajor() {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const [message, setMessage] = useState("");

  const handleNameChange = (ev) => {
    setName(ev.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    postMajor(name)
      .then((major) => {
        setMessage(`Uspešno ste dodali ${major.name}`);
        setError("");
        setLoading(false);
      })
      .catch((err) => {
        setMessage("");
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <form>
      <div className={classes.container}>
        <h1>Dodajte smer</h1>
        <TextField id="standard-basic" label="Ime smera" value={name} onChange={handleNameChange} />
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          className={classes.button}
          startIcon={<PublishIcon />}
        >
          Dodaj smer
        </Button>
        <Link href="/add_course" variant="body2" className={classes.Link}>
          Dodajte i predmete smeru!
        </Link>
        <Typography>{message}</Typography>
        <Typography color="error">{error}</Typography>
        {loading && <CircularProgress className={classes.loading} />}
      </div>
    </form>
  );
}
export default AddMajor;
