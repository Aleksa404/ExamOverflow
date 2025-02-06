const express = require("express");
const path = require("path");
const { request } = require("http");
const port = process.env.PORT || 9090;
const app = express();
const multer = require("multer");
const cors = require("cors");

app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./dist/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

// serve static assets normally
app.use(express.static(__dirname + "/dist/"));

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get("/", function (request, response) {
  response.sendFile(
    path.resolve(__dirname, "dist/exam_paper/", +request.query)
  );
});

app.post("/exam_paper", upload.single("exam_paper"), (req, res, next) => {
  // const tempPath = req.file.path;
  // const targetPath = path.join(__dirname, "./dist/image.png");
  res
    .status(200)
    .contentType("application/json")
    .end(JSON.stringify({ documentUrl: req.file.filename }));

  // if (path.extname(req.file.originalname).toLowerCase() === ".png") {
  //   fs.rename(tempPath, targetPath, (err) => {
  //     if (err) return handleError(err, res);

  //     res.status(200).contentType("text/plain").end("File uploaded!");
  //   });
  // } else {
  //   fs.unlink(tempPath, (err) => {
  //     if (err) return handleError(err, res);

  //     res.status(403).contentType("text/plain").end("Only .png files are allowed!");
  //   });
  // }
});

app.get("/", function (request, response) {
  response.sendFile(path.resolve(__dirname, "dist/", +request.query));
});

app.post("/avatar", upload.single("avatar"), (req, res, next) => {
  res
    .status(200)
    .contentType("application/json")
    .end(JSON.stringify({ avatarUrl: req.file.filename }));
});

app.listen(port);
console.log("server started on port " + port);
