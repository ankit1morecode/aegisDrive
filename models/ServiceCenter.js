const mongoose = require("mongoose");

const serviceCenterSchema = new mongoose.Schema({
  name: String,
  location: {
    lat: Number,
    lng: Number
  },
  supportedModels: [String],
  spareInventory: [
    {
      partName: String,
      cost: Number
    }
  ]
});

module.exports = mongoose.model("ServiceCenter", serviceCenterSchema);
