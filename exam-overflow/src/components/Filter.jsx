import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Box from "@material-ui/core/Box";

import { getMajors, getCourses } from "../service/examPapersService";
import { CLEAR_EXAM_PAPERS } from "../redux/types";
import { loadExamPapers } from "../redux/actions/examPapersActions";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    marginTop: "150px",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function Filter() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [selectedYear, setSelectedYear] = useState(1);
  const [selectedMajorId, setSelectedMajorId] = useState(0);
  const [selectedCourseId, setSelectedCourseId] = useState(0);
  const [majors, setMajors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [years, setYears] = useState(["I", "II", "III", "IV"]);

  useEffect(() => {
    if (majors.length === 0) getMajors().then((result) => setMajors(result));
    if (selectedYear && selectedMajorId) {
      getCourses(selectedMajorId, selectedYear).then((result) => {
        setCourses(result);
      });
    }
    if (selectedCourseId) dispatch(loadExamPapers(selectedCourseId));
    else dispatch({ type: CLEAR_EXAM_PAPERS });
    return () => {};
  }, [selectedYear, selectedMajorId, selectedCourseId]);

  const onYearChange = (event) => {
    setSelectedYear(event.target.value);
    dispatch({ type: CLEAR_EXAM_PAPERS });
  };

  const onMajorChange = (event) => {
    setSelectedMajorId(event.target.value);
    dispatch({ type: CLEAR_EXAM_PAPERS });
  };

  const onCourseChange = (event) => {
    setSelectedCourseId(event.target.value);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexWrap="wrap"
    >
      <FormControl className={classes.formControl}>
        <InputLabel>Godina</InputLabel>
        <Select value={selectedYear} onChange={onYearChange}>
          {years.map((year, index) => (
            <MenuItem key={index + 1} value={index + 1}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {majors.length !== 0 && (
        <FormControl className={classes.formControl}>
          <InputLabel>Smer</InputLabel>
          <Select value={selectedMajorId} onChange={onMajorChange}>
            {majors.map((major) => (
              <MenuItem key={major.id} value={major.id}>
                {major.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      {selectedMajorId !== 0 && selectedYear && (
        <FormControl className={classes.formControl}>
          <InputLabel>Predmet</InputLabel>
          <Select value={selectedCourseId} onChange={onCourseChange}>
            {courses.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
}
