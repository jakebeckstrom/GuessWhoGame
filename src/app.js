const express = require("express");
var serverless = require("serverless-http");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var bodyParser = require("body-parser");

var testAPIRouter = require("./routes/testAPI");
var getImagesRouter = require("./routes/game");
var uploadRouter = require("./routes/upload");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static(path.join("./", "public")));

app.use("/testAPI", testAPIRouter);
app.use("/game", getImagesRouter);
app.use("/upload", uploadRouter);

module.exports = app;
