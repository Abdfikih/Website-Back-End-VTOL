const mongoose = require("mongoose");

const droneSchema = new mongoose.Schema(
  {
    x_axis: String,
    y_axis: String,
    z_axis: String,
    yaw: String,
    pitch: String,
    roll: String,
    alt: String,
  },
  {
    timestamps: true,
  }
);

const Drone = mongoose.model("Drone", droneSchema);
module.exports = Drone;
