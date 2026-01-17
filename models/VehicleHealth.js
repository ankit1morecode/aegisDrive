const mongoose = require("mongoose");

const vehicleHealthSchema = new mongoose.Schema({
  vehicleId: {
    type: String,
    unique: true
  },

  healthScore: Number,
  status: String, // Normal | Warning | Critical

  lastTelemetry: {
    temperature: Number,
    humidity: Number,
    gas: Number,
    vibration: Number
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("VehicleHealth", vehicleHealthSchema);
