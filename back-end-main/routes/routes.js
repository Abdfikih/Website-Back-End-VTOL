const express = require("express");
const router = express.Router();
const droneController = require("../controllers/droneController");

router
  .route("/api/drone")
  .post(droneController.postDrone)
  .get(droneController.getDrone);

module.exports = router;
