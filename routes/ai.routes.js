const express = require("express");
const router = express.Router();

const VehicleHealth = require("../models/VehicleHealth");

// AI Explainability
router.get("/ai-explain", async (req, res) => {
  try {
    const vehicles = await VehicleHealth.find();

    const explanations = vehicles.map(v => {
      const reasons = [];

      if (v.lastTelemetry?.temperature > 70)
        reasons.push("High temperature detected");

      if (v.lastTelemetry?.gas > 500)
        reasons.push("Elevated gas level detected");

      if (v.lastTelemetry?.vibration > 0.05)
        reasons.push("Abnormal vibration detected");

      if (reasons.length === 0)
        reasons.push("All signals within normal range");

      return {
        vehicleId: v.vehicleId,
        status: v.status || "Unknown",
        healthScore: v.healthScore || 0,
        reasons
      };
    });

    res.render("aiExplain", {
      explanations: explanations || []
    });

  } catch (err) {
    console.error(err);
    res.render("aiExplain", { explanations: [] });
  }
});

module.exports = router;
