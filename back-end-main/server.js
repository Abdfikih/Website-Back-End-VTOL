const cors = require('cors');
const express = require('express');
const dotenv = require("dotenv");
const app = require("./app");
const mongoose = require("mongoose");

console.log("step begin");

dotenv.config({
  path: "./config.env",
});

console.log("step end");

mongoose.set('strictQuery', false);
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));
const app = express();
app.use(cors())
app.use(express.json());
const routes = require('./routes/routes');
app.use('/api', routes)
const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`App running on port ${port}... in ${process.env.NODE_ENV} mode`)
);
