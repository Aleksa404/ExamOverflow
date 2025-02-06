import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import Report from "./Report";

//MUI
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbDownAltIcon from "@material-ui/icons/ThumbDownAlt";
import ThumbUpAltIconOutlined from "@material-ui/icons/ThumbUpAltOutlined";
import ThumbDownAltIconOutlined from "@material-ui/icons/ThumbDownAltOutlined";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import SecurityIcon from "@material-ui/icons/Security";

import defaultImage from "../assets/profile/default.jpg";
import { getUser, getUserAvatar } from "../service/userService";
import {
  likeQuestion,
  unDisLikeQuestion,
  unLikeQuestion,
  disLikeQuestion,
} from "../service/questionsService";

import moment from "moment";

const useStyles = makeStyles((theme) => ({
  link: {
    cursor: "pointer",
    margin: 0,
    textAlign: "left",
  },
  profile: {
    cursor: "pointer",
    padding: "4px",
    "&:hover": {
      background: "#dcdcdc",
      borderRadius: "10px",
    },
  },
  shield: {
    position: "relative",
    left: "5px",
    color: "#558b2f",
  },
  marginaComp: {
    margin: "3% 0 3% 0",
    padding: "2%",
  },
  marginaMob: {
    marginLeft: "0px",
    marginRight: "0px",
  },
}));

function Question(props) {
  const classes = useStyles();
  const [likes, setLikes] = useState(0);
  const [alreadyLiked, setAlreadyLiked] = useState(false);
  const [alreadyDisliked, setAlreadyDisliked] = useState(false);
  const [image, setImage] = useState(defaultImage);
  const [user, setUser] = useState({});
  const question = props.question;
  const like = props.like;

  const authenticated = useSelector((state) => state.user.authenticated);

  const history = useHistory();

  useEffect(() => {
    getUser(question.userID).then((user) => {
      getUserAvatar(user.id).then((avatar) => setImage(avatar));
      setUser(user);
      setAlreadyLiked(props.question.liked);
      setAlreadyDisliked(props.question.disliked);
    });
    setLikes(question.likes);

    return () => {};
  }, []);

  const handleLike = () => {
    if (!alreadyLiked && !alreadyDisliked) {
      likeQuestion(question.id).then((res) => {
        setLikes((prevLikes) => prevLikes + 1);
        setAlreadyLiked(true);
      });
    } else if (!alreadyLiked && alreadyDisliked) {
      unDisLikeQuestion(question.id).then((res) => {
        likeQuestion(question.id).then((res) => {
          setLikes((prevLikes) => prevLikes + 2);
          setAlreadyLiked(true);
          setAlreadyDisliked(false);
        });
      });
    } else if (alreadyLiked) {
      unLikeQuestion(question.id).then((res) => {
        setLikes((prevLikes) => prevLikes - 1);
        setAlreadyLiked(false);
      });
    }
  };

  const handleDislike = () => {
    if (!alreadyLiked && !alreadyDisliked) {
      disLikeQuestion(question.id).then((res) => {
        setLikes((prevLikes) => prevLikes - 1);
        setAlreadyDisliked(true);
      });
    } else if (alreadyLiked && !alreadyDisliked) {
      unLikeQuestion(question.id).then((res) => {
        disLikeQuestion(question.id).then((res) => {
          setLikes((prevLikes) => prevLikes - 2);
          setAlreadyLiked(false);
          setAlreadyDisliked(true);
        });
      });
    } else if (alreadyDisliked) {
      unDisLikeQuestion(question.id).then((res) => {
        setLikes((prevLikes) => prevLikes + 1);
        setAlreadyDisliked(false);
      });
    }
  };

  const handleClickQuestion = (questionId) => {
    history.push("/browse_answers/" + questionId);
  };

  const handleProfile = () => {
    history.push("/profile/" + user.id);
  };

  return (
    <div>
      <Paper id={question.id} className={classes.marginaComp}>
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <div
              className={classes.profile}
              onClick={handleProfile}
              title={"karma: " + user.karma}
            >
              <Avatar alt="Profile" src={image} />
              {user.role === "Admin" ? (
                <div>
                  <Typography style={{ color: "#558b2f", fontWeight: "bold" }}>
                    {user.userName}
                  </Typography>
                  <SecurityIcon className={classes.shield} />
                </div>
              ) : (
                <Typography>{user.userName}</Typography>
              )}
            </div>
            {authenticated && <Report type="question" postId={question.id} />}
          </Grid>
          <Grid item xs zeroMinWidth style={{ paddingLeft: "20px" }}>
            <Link
              onClick={() => handleClickQuestion(question.id)}
              variant="h6"
              color="inherit"
              className={classes.link}
            >
              {question.title}
            </Link>

            <Typography
              dangerouslySetInnerHTML={{ __html: question.content }}
              style={{ textAlign: "left" }}
            ></Typography>
            <p style={{ textAlign: "left", color: "gray" }}>
              {moment(new Date(question.postTime)).fromNow()}
            </p>
          </Grid>

          <Grid item>
            {like && (
              <Container display="flex" align="center">
                {authenticated ? (
                  <IconButton
                    color={alreadyLiked ? "primary" : "default"}
                    onClick={handleLike}
                  >
                    {alreadyLiked ? (
                      <ThumbUpAltIcon />
                    ) : (
                      <ThumbUpAltIconOutlined />
                    )}
                  </IconButton>
                ) : (
                  <IconButton>
                    <FiberManualRecordIcon />
                  </IconButton>
                )}
                <Typography value={likes}>{likes}</Typography>
                {authenticated ? (
                  <IconButton
                    color={alreadyDisliked ? "secondary" : "default"}
                    onClick={handleDislike}
                  >
                    {alreadyDisliked ? (
                      <ThumbDownAltIcon />
                    ) : (
                      <ThumbDownAltIconOutlined />
                    )}
                  </IconButton>
                ) : (
                  <IconButton>
                    <FiberManualRecordIcon />
                  </IconButton>
                )}
              </Container>
            )}
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default Question;
