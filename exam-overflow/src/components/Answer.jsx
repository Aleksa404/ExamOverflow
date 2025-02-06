import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import Report from "./Report";

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
  likeAnswer,
  unLikeAnswer,
  disLikeAnswer,
  unDisLikeAnswer,
} from "../service/answersService";

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
}));

function Answer(props) {
  const classes = useStyles();
  const [likes, setLikes] = useState(0);
  const [alreadyLiked, setAlreadyLiked] = useState(false);
  const [alreadyDisliked, setAlreadyDisliked] = useState(false);
  const [image, setImage] = useState(defaultImage);
  const [user, setUser] = useState({});
  const answer = props.answer;
  const like = props.like;

  const authenticated = useSelector((state) => state.user.authenticated);

  const history = useHistory();

  useEffect(() => {
    getUser(answer.userID).then((user) => {
      getUserAvatar(user.id).then((avatar) => setImage(avatar));
      setUser(user);
      setAlreadyLiked(props.answer.liked);
      setAlreadyDisliked(props.answer.disliked);
    });
    setLikes(answer.likes);

    return () => {};
  }, []);

  const handleLike = () => {
    if (!alreadyLiked && !alreadyDisliked) {
      likeAnswer(answer.id).then((res) => {
        setLikes((prevLikes) => prevLikes + 1);
        setAlreadyLiked(true);
      });
    } else if (!alreadyLiked && alreadyDisliked) {
      unDisLikeAnswer(answer.id).then((res) => {
        likeAnswer(answer.id).then((res) => {
          setLikes((prevLikes) => prevLikes + 2);
          setAlreadyLiked(true);
          setAlreadyDisliked(false);
        });
      });
    } else if (alreadyLiked) {
      unLikeAnswer(answer.id).then((res) => {
        setLikes((prevLikes) => prevLikes - 1);
        setAlreadyLiked(false);
      });
    }
  };

  const handleDislike = () => {
    if (!alreadyLiked && !alreadyDisliked) {
      disLikeAnswer(answer.id).then((res) => {
        setLikes((prevLikes) => prevLikes - 1);
        setAlreadyDisliked(true);
      });
    } else if (alreadyLiked && !alreadyDisliked) {
      unLikeAnswer(answer.id).then((res) => {
        disLikeAnswer(answer.id).then((res) => {
          setLikes((prevLikes) => prevLikes - 2);
          setAlreadyLiked(false);
          setAlreadyDisliked(true);
        });
      });
    } else if (alreadyDisliked) {
      unDisLikeAnswer(answer.id).then((res) => {
        setLikes((prevLikes) => prevLikes + 1);
        setAlreadyDisliked(false);
      });
    }
  };

  const handleProfile = () => {
    history.push("/profile/" + user.id);
  };

  return (
    <div>
      <Paper id={answer.id} className={classes.marginaComp}>
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
            {authenticated && <Report type="answer" postId={answer.id} />}
          </Grid>
          <Grid item xs zeroMinWidth style={{ paddingLeft: "20px" }}>
            <Link variant="h6" color="inherit" className={classes.link}>
              {answer.title}
            </Link>

            <Typography
              dangerouslySetInnerHTML={{ __html: answer.content }}
              style={{ textAlign: "left" }}
            ></Typography>
            <p style={{ textAlign: "left", color: "gray" }}>
              {moment(new Date(answer.postTime)).fromNow()}
            </p>
          </Grid>

          {like && (
            <Grid item>
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
            </Grid>
          )}
        </Grid>
      </Paper>
    </div>
  );
}

export default Answer;
