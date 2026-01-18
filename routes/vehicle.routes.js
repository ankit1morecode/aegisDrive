const express = require("express");
const router = express.Router();

const VehicleHealth = require("../models/VehicleHealth");

// Vehicle Digital Twin
router.get("/vehicles/:vehicleId", async (req, res) => {
  try {
    const vehicleId = req.params.vehicleId;
    const vehicle = await VehicleHealth.findOne({ vehicleId });

    res.render("vehicleTwin", {
      vehicleId,
      vehicle: vehicle || null
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
