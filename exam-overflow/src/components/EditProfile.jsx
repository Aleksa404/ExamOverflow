import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import EditIcon from "@material-ui/icons/Edit";

import { useSelector, useDispatch } from "react-redux";
import { loadProfile, changeUsernameAvatar } from "../redux/actions/profileActions";
import { uploadProfileImage, editUsernameAvatar } from "../service/userService";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  space: {
    padding: theme.spacing(2),
    textAlign: "center",
  },
  paper: {
    margin: theme.spacing(3),
    paddingBottom: "30px",
  },
  avatar: {
    width: "200px",
    height: "200px",
  },
  loading: {
    width: "500px",
    height: "500px",
    margin: "0 auto",
  },
  edit: {
    position: "relative",
    top: "10px",
  },
}));

function EditProfile() {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = useSelector((state) => state.profile.user);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    if (!user) dispatch(loadProfile(id));
    else {
      setUsername(user.userName);
      setProfileImage(user.avatar);
    }
    return () => {};
  }, [user]);

  const handleUsernameChange = (ev) => {
    setUsername(ev.target.value);
  };

  const onFileChange = (event) => {
    setLoading(true);
    const file = event.target.files[0];
    if (!file.name.includes(".jpg") && !file.name.includes(".png")) {
      setError("Tip fajla nije podržan, podržani su .jpg i .png");
      setLoading(false);
      return;
    }
    uploadProfileImage(file)
      .then((url) => {
        setProfileImage(url);
        setError("");
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!error.length) {
      editUsernameAvatar(user.id, username, profileImage).then((res) => {
        dispatch(changeUsernameAvatar(user, username, profileImage));
        history.push(`/profile/${user.id}`);
      });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      {user && (
        <form noValidate autoComplete="off">
          <Paper variant="outlined" className={classes.paper}>
            <div className={classes.container}>
              <Avatar className={classes.avatar} src={profileImage}></Avatar>
              <br />
              <div>
                <TextField value={username} onChange={handleUsernameChange} label="username" />
                <EditIcon className={classes.edit} />
              </div>
              <br />
              <input className={classes.fileControl} type="file" name="file" onChange={onFileChange} />
              <br />
              <Button onClick={handleSubmit} variant="contained" color="primary">
                Sačuvaj promene
              </Button>
            </div>
          </Paper>
        </form>
      )}
      <Typography error>{error}</Typography>
      {loading && <CircularProgress className={classes.loading} />}
    </Container>
  );
}

export default EditProfile;
