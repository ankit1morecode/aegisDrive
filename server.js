require("dotenv").config();
const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");
const mqttClient = require("./config/mqttClient");
const connectDB = require("./config/db");

const PORT = process.env.PORT;

// Connect MongoDB
connectDB();

const server = http.createServer(app);
const io = new Server(server);

// MQTT → Socket.IO
mqttClient.initSocket(io);

io.on("connection", () => {
  console.log("🌐 Browser connected");
});

server.listen(PORT, () => {
  console.log(`🚀 AegisDRIVE running on http://localhost:${PORT}`);
});
