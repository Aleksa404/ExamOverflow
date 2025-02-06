import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
//Mui stuff
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Link from "@material-ui/core/Link";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";

import logo from "../assets/logo/logo.png";

import { logoutUser } from "../redux/actions/userActions";
import { getUnapprovedExamPapersCount } from "../service/examPapersService";

const useStyles = makeStyles((theme) => ({
  container: {
    marginBottom: "0",
  },
  grow: {
    flexGrow: 1,
  },
  spacing: {
    margin: theme.spacing(1),
  },
  logoContainer: {
    cursor: "pointer",
  },
  logo: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#6573c3",
      borderRadius: "20px",
    },
  },
}));

function NavBar() {
  //Mui stuff
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const classes = useStyles();
  //Redux stuff
  const dispatch = useDispatch();
  const authenticated = useSelector((state) => state.user.authenticated);
  const user = useSelector((state) => state.user.user);
  //Router stuff
  const history = useHistory();

  const [avatar, setAvatar] = useState("");
  const [unapprovedExamPapersCount, setUnapprovedExamPapersCount] = useState(0);

  useEffect(() => {
    if (user) {
      setAvatar(user.avatar);
      if (user.role === "Admin") {
        getUnapprovedExamPapersCount()
          .then((res) => {
            setUnapprovedExamPapersCount(res.count);
          })
          .catch((err) => setUnapprovedExamPapersCount(0));
      }
    }

    return () => {};
  }, [user]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    dispatch(logoutUser());
    history.push("/");
  };

  const handleProfile = () => {
    handleClose();
    history.push("/profile/" + user.id);
  };

  const handleNewExamPaper = () => {
    handleClose();
    history.push("/post_exam_paper_form");
  };

  const handleUnapprovedExamPapers = () => {
    handleClose();
    history.push("/approve_exam_papers");
  };

  const handleAddCourse = () => {
    handleClose();
    history.push("/add_course");
  };

  const handleAddMajor = () => {
    handleClose();
    history.push("/add_major");
  };

  const handleAddAdmin = () => {
    handleClose();
    history.push("/add_admin");
  };

  const handleReports = () => {
    handleClose();
    history.push("/reported_posts");
  };

  const getProfileImage = () => {
    if (avatar) {
      return <Avatar alt="Profile" src={avatar}></Avatar>;
    }
    return <AccountCircleIcon />;
  };

  const getBadge = () => {
    if (user.role === "Admin")
      return (
        <IconButton
          onClick={() => history.push("/approve_exam_papers")}
          aria-label="Neodobreni blanketi"
          color="inherit"
        >
          <Badge badgeContent={unapprovedExamPapersCount} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      );
  };

  return (
    <div classes="container">
      <AppBar position="fixed">
        <Toolbar>
          <Link className={classes.logo} color="inherit" onClick={() => history.push("/")}>
            <img src={logo} alt="Logo" width="70px" />
          </Link>
          <div className={classes.logoContainer}>
            <Typography variant="h6" noWrap>
              <Link color="inherit" onClick={() => history.push("/")}>
                Exam Overflow
              </Link>
            </Typography>
          </div>
          <div className={classes.grow}></div>
          <div>
            {authenticated ? (
              <React.Fragment>
                {getBadge()}
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  color="inherit"
                  aria-controls="fade-menu"
                  onClick={handleClick}
                >
                  {getProfileImage()}
                </IconButton>
              </React.Fragment>
            ) : (
              <Box display="flex" flexWrap="noWrap">
                <Button
                  variant="outlined"
                  color="inherit"
                  className={classes.spacing}
                  onClick={() => history.push("/login")}
                >
                  Login
                </Button>
                <Button variant="contained" className={classes.spacing} onClick={() => history.push("/register")}>
                  Registruj se
                </Button>
              </Box>
            )}

            <Menu
              id="fade-menu"
              anchorEl={anchorEl}
              keepMounted
              open={open}
              onClose={handleClose}
              TransitionComponent={Fade}
            >
              <MenuItem onClick={handleProfile}>Profil</MenuItem>
              <MenuItem onClick={handleNewExamPaper}>Dodaj blanket</MenuItem>
              {user && user.role === "Admin" && (
                <MenuItem onClick={handleUnapprovedExamPapers}>Neodobreni blanketi</MenuItem>
              )}
              {user && user.role === "Admin" && <MenuItem onClick={handleAddMajor}>Dodaj smer</MenuItem>}
              {user && user.role === "Admin" && <MenuItem onClick={handleAddCourse}>Dodaj predmet</MenuItem>}
              {user && user.role === "Admin" && <MenuItem onClick={handleAddAdmin}>Dodaj admina</MenuItem>}
              {user && user.role === "Admin" && <MenuItem onClick={handleReports}>Prijavljeni postovi</MenuItem>}
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default NavBar;
