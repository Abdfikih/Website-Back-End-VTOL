const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes/routes");

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in an hour",
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "PUT,POST,GET,DELETE,PATCH,OPTIONS"
  );
  next();
});

app.use("/api", limiter);
app.use(
  express.json({
    limit: "20MB",
  })
);

app.use(xss());
app.use(cors());

app.use(router);

module.exports = app;
