import React from "react";
import Filter from "../components/Filter";
import ExamPapers from "../components/ExamPapers";

import Container from "@material-ui/core/Container";

function browseExamPapers() {
  return (
    <Container>
      <Filter />
      <ExamPapers />
    </Container>
  );
}

export default browseExamPapers;
