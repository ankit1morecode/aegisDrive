const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema({
  vehicleId: String,
  issue: String,
  predictedFaultyParts: [String],

  serviceCenterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceCenter"
  },

  estimatedCost: Number,
  status: {
    type: String,
    enum: ["Pending", "Estimated", "Confirmed", "Completed"],
    default: "Pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);
