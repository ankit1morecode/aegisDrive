const mongoose = require("mongoose");

const telemetrySchema = new mongoose.Schema({
  vehicleId: {
    type: String,
    required: true,
    index: true
  },

  temperature: Number,
  humidity: Number,
  gas: Number,
  vibration: Number,

  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model("Telemetry", telemetrySchema);