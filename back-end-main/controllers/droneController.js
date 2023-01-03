const Drone = require("../models/drone");

const getDrone = async (req, res) => {
  try {
    const drone = await Drone.find();
    return res.status(200).json(drone);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const postDrone = async (req, res) => {
  const drone = new Drone({
    x_axis: req.body.x_axis,
    y_axis: req.body.y_axis,
    z_axis: req.body.z_axis,
    yaw: req.body.yaw,
    pitch: req.body.pitch,
    roll: req.body.roll,
    alt: req.body.alt,
    long: req.body.long,
    lat: req.body.lat,
  });
  try {
    const newDrone = await drone.save();
    res.status(201).json(newDrone);
  } catch (e) {
    res.status(400).json({ message: e.errors });
  }
};
module.exports = {
  postDrone,
  getDrone,
};
