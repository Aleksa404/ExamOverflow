import React from "react";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
//Mui
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  imageContainer: {
    marginTop: "100px",
  },
  img: {
    width: "100vw",
    maxWidth: "70vw",
  },
  loading: {
    margin: "200px auto 0 auto",
    width: "400px",
    height: "400px",
  },
}));

function ExamPaper(props) {
  const classes = useStyles();
  const examPaper = props.examPaper;

  return (
    <React.Fragment>
      {examPaper ? (
        <div className={classes.imageContainer}>
          <TransformWrapper defaultScale={1} defaultPositionX={200} defaultPositionY={100}>
            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
              <div style={{ marginLeft: "auto", marginRight: "auto" }}>
                <TransformComponent>
                  <img className={classes.img} src={examPaper.documentUrl} alt="Blanket nije pronađen" />
                </TransformComponent>
                <div className="tools">
                  <IconButton onClick={zoomIn}>
                    <ZoomInIcon />
                  </IconButton>
                  <IconButton onClick={zoomOut}>
                    <ZoomOutIcon />
                  </IconButton>
                  <IconButton onClick={resetTransform}>
                    <ZoomOutMapIcon />
                  </IconButton>
                </div>
              </div>
            )}
          </TransformWrapper>
        </div>
      ) : (
        <CircularProgress className={classes.loading} />
      )}
    </React.Fragment>
  );
}
export default ExamPaper;
