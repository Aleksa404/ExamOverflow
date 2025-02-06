import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { getCourses, getMajors, postExamPaper } from "../service/examPapersService";

//MUI
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  fileControl: {
    margin: "0 auto",
  },
  container: {
    height: "80vw",
    maxHeight: "400px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
  },
  paper: {
    maxWidth: "600px",
    margin: "10vw auto 0 auto",
  },
}));

function PostExamPaperForm() {
  const classes = useStyles();
  const history = useHistory();

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");
  const [courseId, setCourseId] = useState("");
  const [examType, setExamType] = useState("");
  const [year, setYear] = useState("");
  const [term, setTerm] = useState("");
  const [file, setFile] = useState("");
  const [error, setError] = useState("");
  const [majors, setMajors] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (majors.length === 0) getMajors().then((res) => setMajors(res));
    return () => {};
  }, []);

  const onYearChange = (event) => {
    if (!event.target.value) return;
    setCourseId(0);
    setSelectedYear(event.target.value);
    if (selectedMajor) {
      getCourses(selectedMajor, event.target.value).then((res) => setCourses(res));
    }
  };

  const onMajorChange = (event) => {
    if (!event.target.value) return;
    setCourseId(0);
    setSelectedMajor(event.target.value);
    if (selectedYear) {
      getCourses(event.target.value, selectedYear).then((res) => setCourses(res));
    }
  };

  const onCourseChange = (event) => {
    //if (!event.target.value) return;
    setCourseId(event.target.value);
  };

  const onFileChange = (event) => {
    if (!event.target.files.length) return;
    const name = event.target.files[0].name;
    if (name.includes(".jpg") || name.includes(".png")) {
      setFile(event.target.files[0]);
    } else {
      setError("Tip fajla nije podržan (podržani .jpg i .png)");
    }
  };

  const onExamYearChange = (event) => {
    setYear(event.target.value);
  };

  const onTermChange = (event) => {
    setTerm(event.target.value);
  };

  const onTypeChange = (event) => {
    setExamType(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (courseId && examType && year && term && file) {
      postExamPaper(courseId, examType, year, term, file)
        .then((data) => {
          history.push("/");
          alert("Uspešno ste dodali blanket. potrebno je samo još Administrator da odobri dodavanje.");
        })
        .catch((err) => setError(err.message));
    } else {
      setError("Sva polja su obavezna!");
    }
  };

  const getTerms = () => ["Januar", "April", "Jun I", "Jun II", "Septembar", "Oktobar", "Novembar", "Decembar"];
  const getTypes = () => ["Pismeni", "Usmeni", "Kolokvijum I", "Kolokvijum II", "Kolokvijum III"];

  return (
    <Paper className={classes.paper}>
      <Box className={classes.container}>
        <Box display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
          <FormControl className={classes.formControl}>
            <InputLabel>Godina</InputLabel>
            <Select onClick={onYearChange}>
              {["I", "II", "III", "IV"].map((year, index) => (
                <MenuItem key={index + 1} value={index + 1}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel>Smer</InputLabel>
            <Select onChange={onMajorChange}>
              {majors.length !== 0 &&
                majors.map((major) => (
                  <MenuItem key={major.id} value={major.id}>
                    {major.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          {selectedMajor && selectedYear && (
            <FormControl className={classes.formControl}>
              <InputLabel>Predmet</InputLabel>
              <Select onChange={onCourseChange}>
                {courses.length !== 0 &&
                  courses.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
        </Box>

        <Box display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
          <FormControl className={classes.formControl}>
            <InputLabel>Godina</InputLabel>
            <Select onClick={onExamYearChange}>
              {[...Array(11).keys()].map((num) => (
                <MenuItem key={num + 1} value={num + 2010}>
                  {num + 2010}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel>Rok</InputLabel>
            <Select onClick={onTermChange}>
              {getTerms().map((term, index) => (
                <MenuItem key={index} value={term}>
                  {term}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel>Tip</InputLabel>
            <Select onClick={onTypeChange}>
              {getTypes().map((type, index) => (
                <MenuItem key={index} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <input className={classes.fileControl} type="file" name="file" onChange={onFileChange} />
        <Button variant="contained" color="primary" onClick={onSubmit}>
          Pošalji
        </Button>
        <Typography color="error">{error}</Typography>
      </Box>
    </Paper>
  );
}

export default PostExamPaperForm;
