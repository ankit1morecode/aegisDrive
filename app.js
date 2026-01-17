const express = require("express");
const path = require("path");

const VehicleHealth = require("./models/VehicleHealth");
const Telemetry = require("./models/Telemetry");

const app = express();

/* ---------- VIEW ENGINE ---------- */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ---------- STATIC FILES ---------- */
app.use(express.static(path.join(__dirname, "public")));

/* ---------- ROUTES ---------- */

// Dashboard
app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

// Vehicle Digital Twin
app.get("/vehicles/:vehicleId", async (req, res) => {
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

// Telemetry
app.get("/telemetry", (req, res) => {
  res.render("telemetry");
});

// Telemetry API
app.get("/api/telemetry/:vehicleId", async (req, res) => {
  const data = await Telemetry.find({ vehicleId: req.params.vehicleId })
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(data.reverse());
});

// Map
app.get("/map", (req, res) => {
  res.render("map");
});

// Predictive Maintenance
app.get("/maintenance", async (req, res) => {
  try {
    const vehicles = await VehicleHealth.find();

    const maintenanceList = vehicles.map(v => {
      let component = "General";
      let risk = "Low";
      let eta = "30 days";

      if (v.lastTelemetry && v.lastTelemetry.temperature > 70) {
        component = "Engine Cooling";
        risk = "High";
        eta = "5 days";
      } else if (v.lastTelemetry && v.lastTelemetry.gas > 500) {
        component = "Gas System";
        risk = "Medium";
        eta = "10 days";
      } else if (v.lastTelemetry && v.lastTelemetry.vibration > 0.05) {
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
    console.error("Maintenance error:", err);
    res.render("maintenance", { maintenanceList: [] });
  }
});

// AI Explainability
app.get("/ai-explain", async (req, res) => {
  try {
    const vehicles = await VehicleHealth.find();

    const explanations = vehicles.map(v => {
      const reasons = [];

      if (v.lastTelemetry && v.lastTelemetry.temperature > 70) {
        reasons.push("High temperature detected");
      }
      if (v.lastTelemetry && v.lastTelemetry.gas > 500) {
        reasons.push("Elevated gas level detected");
      }
      if (v.lastTelemetry && v.lastTelemetry.vibration > 0.05) {
        reasons.push("Abnormal vibration detected");
      }

      if (reasons.length === 0) {
        reasons.push("All signals within normal range");
      }

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
    console.error("AI Explain error:", err);
    res.render("aiExplain", { explanations: [] });
  }
});


app.get("/service-centers/nearby", async (req, res) => {
  const centers = await ServiceCenter.find();
  res.json(centers); // later filter by distance
});


app.post("/book-service", async (req, res) => {
  const {
    vehicleId,
    issue,
    predictedFaultyParts,
    serviceCenterId
  } = req.body;

  const request = await ServiceRequest.create({
    vehicleId,
    issue,
    predictedFaultyParts,
    serviceCenterId
  });

  res.json({
    message: "Service booked successfully",
    requestId: request._id
  });
});


app.post("/service-estimate/:requestId", async (req, res) => {
  const { estimatedCost } = req.body;

  const request = await ServiceRequest.findByIdAndUpdate(
    req.params.requestId,
    {
      estimatedCost,
      status: "Estimated"
    },
    { new: true }
  );

  res.json(request);
});



module.exports = app;
