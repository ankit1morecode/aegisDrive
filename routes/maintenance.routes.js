const express = require("express");
const router = express.Router();

const VehicleHealth = require("../models/VehicleHealth");

// Predictive Maintenance
router.get("/maintenance", async (req, res) => {
  try {
    const vehicles = await VehicleHealth.find();

    const maintenanceList = vehicles.map(v => {
      let component = "General";
      let risk = "Low";
      let eta = "30 days";

      if (v.lastTelemetry?.temperature > 70) {
        component = "Engine Cooling";
        risk = "High";
        eta = "5 days";
      } else if (v.lastTelemetry?.gas > 500) {
        component = "Gas System";
        risk = "Medium";
        eta = "10 days";
      } else if (v.lastTelemetry?.vibration > 0.05) {
        component = "Brake System";
        risk = "High";
        eta = "7 days";
      }

      return {
        vehicleId: v.vehicleId,
        component,
        risk,
        eta
      };
    });

    res.render("maintenance", {
      maintenanceList: maintenanceList || []
    });

  } catch (err) {
    console.error(err);
    res.render("maintenance", { maintenanceList: [] });
  }
});

module.exports = router;
