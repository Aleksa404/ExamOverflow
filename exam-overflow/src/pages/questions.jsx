import React from "react";
import Questions from "../components/Questions";
import Scroll from "../components/Scroll";

import Container from "@material-ui/core/Container";

function questions() {
  return (
    <Container>
      {/* Slicka */}
      <Questions />

      <Scroll />
    </Container>
  );
}

export default questions;
