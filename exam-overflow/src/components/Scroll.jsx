import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";

const useStayles = makeStyles((theme) => ({
  scrollTop: {
    position: "fixed",
    width: "30px",
    bottom: "20px",
    right: "30px",
    zIndex: "99",
    border: "none",
    outline: "none",
    backgroundColor: "blue",
    cursor: "pointer",
    borderRadius: "10px",
    animation: "fadeIn 0.3s",
    transition: "opacity 0.4s",
    opacity: "0.5",
  },
}));

function ScrollArrow() {
  const classes = useStayles();
  const [showScroll, setShowScroll] = useState(false);

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 400) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400) {
      setShowScroll(false);
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.addEventListener("scroll", checkScrollTop);

  return (
    <IconButton
      className={classes.scrollTop}
      onClick={scrollTop}
      style={{ height: 40, display: showScroll ? "flex" : "none" }}
      title="Vrati se na vrh tranice"
    >
      <ArrowUpwardIcon color="secondary" fontSize="large" />
    </IconButton>
  );
}

export default ScrollArrow;
