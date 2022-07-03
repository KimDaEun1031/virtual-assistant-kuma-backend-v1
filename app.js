require("dotenv").config();

const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const createError = require("http-errors");

const app = express();

const indexRouter = require("./routes/index");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
    credential: "true",
  })
);

app.use("/", indexRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.json({
    stack: err.stack,
    message: err.message,
  });
});

module.exports = app;
