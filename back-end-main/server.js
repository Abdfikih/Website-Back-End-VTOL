const dotenv = require("dotenv");
const app = require("./app");
const mongoose = require("mongoose");

dotenv.config({
  path: "./config.env",
});

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));
const port = process.env.NODE_ENV || 5000;
app.listen(port, () =>
  console.log(`App running on port ${port}... in ${process.env.NODE_ENV} mode`)
);