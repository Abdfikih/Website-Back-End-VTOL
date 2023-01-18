const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../config.env") });
// require("dotenv").config();
const dotenv = require("dotenv");
const app = require("./app");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

var mongoString = "mongodb+srv://vtol_auav:KERUPUKKOPI@vtol1.pcfeymo.mongodb.net/ESP32?retryWrites=true&w=majority";

console.log("step begin");

console.log(process.env.DATABASE_URL);

console.log("step end");
console.log(process.env.NODE_ENV);

// mongoose.connect(process.env.mongodb, {
//   useUnifiedTopology: true,
//   useNewUrlParser: true,
//   useCreateIndex: true,
// });

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});
app.use(cors());
app.use(express.json());

const routes = require("./routes/routes");

app.use("/api", routes);

app.listen(5000, () => {
  console.log(`Server Started at ${5000}`);
});
