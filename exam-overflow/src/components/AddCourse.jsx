import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Container from "@material-ui/core/Container";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import { getMajors } from "../service/examPapersService";
import { addCourse } from "../redux/actions/courseActions";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  godina: {
    display: "flex",
    flexDirection: "row",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },
}));

function AddCourse() {
  const classes = useStyles();
  const [name, setName] = useState();
  const [selectedYear, setSelectedYear] = useState(0);
  const [selectedMajorId, setSelectedMajorId] = useState(0);
  const [majors, setMajors] = useState([]);
  const loading = useSelector((state) => state.course.loading);
  const error = useSelector((state) => state.course.error);
  const message = useSelector((state) => state.course.message);
  const dispatch = useDispatch();

  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const onYearChange = (event) => {
    setSelectedYear(event.target.value);
  };
  const onMajorChange = (event) => {
    setSelectedMajorId(event.target.value);
  };
  useEffect(() => {
    if (majors.length === 0) getMajors().then((result) => setMajors(result));
    return () => {};
  }, [selectedMajorId]);

  const submitCourse = (ev) => {
    dispatch(addCourse(name, selectedYear, selectedMajorId));
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.container}>
        <h1>Dodaj novi predmet</h1>
        <TextField
          id="standard-basic"
          label="Naziv"
          onChange={handleNameChange}
        />
        <FormControl className={classes.formControl}>
          <InputLabel>Godina slusanja</InputLabel>
          <Select value={selectedYear} onChange={onYearChange}>
            {["I", "II", "III", "IV"].map((year, index) => (
              <MenuItem key={index + 1} value={index + 1}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel>Smer</InputLabel>
          <Select value={selectedMajorId} onChange={onMajorChange}>
            {majors.length !== 0 &&
              majors.map((major) => (
                <MenuItem key={major.id} value={major.id}>
                  {major.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          startIcon={<CloudUploadIcon />}
          onSubmit={(ev) => submitCourse(ev)}
        >
          Dodaj predmet
        </Button>
        <Typography>{message}</Typography>
        <Typography color="error">{error}</Typography>
        {loading && <CircularProgress className={classes.loading} />}
      </div>
    </Container>
  );
}
export default AddCourse;
