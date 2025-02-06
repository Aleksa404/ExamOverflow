import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { makeStyles, Typography } from "@material-ui/core/";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuBookTwoToneIcon from "@material-ui/icons/MenuBookTwoTone";
import TodayIcon from "@material-ui/icons/Today";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  loading: {
    margin: "200px auto 0 auto",
    width: "400px",
    height: "400px",
  },
}));

function ExamPapers() {
  const classes = useStyles();
  const history = useHistory();
  const isLoading = useSelector((state) => state.examPapers.loadingExamPapers);
  const examPapers = useSelector((state) => state.examPapers.examPapers);
  const error = useSelector((state) => state.examPapers.examPapersError);

  const handleClick = (examPaperId) => {
    history.push("/browse_questions/" + examPaperId);
  };

  const renderList = () => {
    const years = examPapers.map((examPaper) => examPaper.year);
    const uniqueYears = years.filter((x, i, a) => a.indexOf(x) === i);
    return (
      <div>
        {error && <Typography error>{error}</Typography>}
        {uniqueYears.map((year) => (
          <List
            key={year}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={<ListSubheader component="div">{year}</ListSubheader>}
            className={classes.root}
          >
            {examPapers
              .filter((examPaper) => examPaper.year === year)
              .map((examPaper) => (
                <ListItem key={examPaper.id} button onClick={() => handleClick(examPaper.id)}>
                  <ListItemIcon>
                    <MenuBookTwoToneIcon />
                  </ListItemIcon>
                  <ListItemText primary={examPaper.type} />
                  <ListItemIcon>
                    <TodayIcon />
                  </ListItemIcon>
                  <ListItemText primary={examPaper.term} />
                </ListItem>
              ))}
          </List>
        ))}
      </div>
    );
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
      {isLoading && <CircularProgress className={classes.loading} color="secondary" />}
      {examPapers && renderList()}
    </Box>
  );
}

export default ExamPapers;
