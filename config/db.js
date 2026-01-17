const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("🗄️ MongoDB connected");
  } catch (err) {
    console.error("MongoDB error:", err.message);
  }
};

module.exports = connectDB;
