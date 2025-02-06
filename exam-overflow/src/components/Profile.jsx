import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import SecurityIcon from "@material-ui/icons/Security";

import { useSelector, useDispatch } from "react-redux";
import { loadProfile } from "../redux/actions/profileActions";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(15),
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
  admin: {
    color: "#558b2f",
    fontWeight: "bold",
  },
  userName: {
    display: "flex",
    flexDirection: "row",
  },
}));

function Profile() {
  const { id } = useParams();
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.profile.user);
  const loading = useSelector((state) => state.profile.loading);
  const error = useSelector((state) => state.profile.error);
  const myProfile = useSelector((state) => state.profile.myProfile);

  useEffect(() => {
    dispatch(loadProfile(id));
    return () => {};
  }, []);

  const handleEdit = () => {
    history.push("/profile/edit/" + user.id);
  };

  return (
    <Container component="main" maxWidth="xs">
      {error && <Typography error>{error}</Typography>}
      {loading && <CircularProgress className={classes.loading} />}
      {user && (
        <Paper variant="outlined" className={classes.paper}>
          <div className={classes.container}>
            <Avatar className={classes.avatar} src={user.avatar}></Avatar>
            <br />
            {user.role === "Admin" ? (
              <div className={classes.userName}>
                <Typography variant="h4" className={classes.admin}>
                  {user.userName}
                </Typography>
                <SecurityIcon fontSize="large" style={{ color: "#558b2f" }} />
              </div>
            ) : (
              <Typography variant="h4">{user.userName}</Typography>
            )}

            <br />
            <Typography>{user.email}</Typography>
            <br />
            <Typography>Karma: {user.karma}</Typography>
            <br />
            {myProfile && (
              <Button type="submit" variant="contained" color="primary" onClick={handleEdit}>
                Izmeni profil
              </Button>
            )}
          </div>
        </Paper>
      )}
    </Container>
  );
}

export default Profile;
