const mongoose = require("mongoose");

const droneSchema = new mongoose.Schema({
  cordinat: {
    x_axis: String,
    y_axis: String,
    z_axis: String,
    yaw: String,
    pitch: String,
    roll: String,
    alt: String,
  },
  // {
  //   timestamps: true,
  // },
  temperature: {
    required: true,
    type: Number,
  },
  humidity: {
    required: true,
    type: Number,
  },
  moisture: {
    required: true,
    type: Number,
  },
});
const Drone = mongoose.model("Drone", droneSchema);
module.exports = Drone;
