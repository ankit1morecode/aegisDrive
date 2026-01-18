const express = require("express");
const router = express.Router();

const Telemetry = require("../models/Telemetry");

// Telemetry page
router.get("/telemetry", (req, res) => {
  res.render("telemetry");
});

// Telemetry API
router.get("/api/telemetry/:vehicleId", async (req, res) => {
  const data = await Telemetry.find({ vehicleId: req.params.vehicleId })
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(data.reverse());
});

module.exports = router;
