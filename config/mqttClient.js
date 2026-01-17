const mqtt = require("mqtt");
const Telemetry = require("../models/Telemetry");
const VehicleHealth = require("../models/VehicleHealth");

const client = mqtt.connect(process.env.MQTT_URL);
const topic = process.env.MQTT_TOPIC;

let ioRef;

client.on("connect", () => {
  console.log("📡 MQTT connected");
  client.subscribe(topic);
});

client.on("message", async (_, message) => {
  try {
    const data = JSON.parse(message.toString());

    // 1️⃣ Save telemetry (history)
    await Telemetry.create(data);

    // 2️⃣ Calculate health score (simple logic)
    let health = 100;
    if (data.temperature > 70) health -= 20;
    if (data.gas > 500) health -= 20;
    if (data.vibration > 0.05) health -= 20;

    let status = "Normal";
    if (health < 70) status = "Warning";
    if (health < 40) status = "Critical";

    // 3️⃣ Update Digital Twin state
    await VehicleHealth.findOneAndUpdate(
      { vehicleId: data.vehicleId },
      {
        vehicleId: data.vehicleId,
        healthScore: health,
        status,
        lastTelemetry: data,
        updatedAt: new Date()
      },
      { upsert: true }
    );

    // 4️⃣ Emit live update
    if (ioRef) {
      ioRef.emit("vehicle_update", {
        ...data,
        health
      });
    }

  } catch (err) {
    console.error("MQTT processing error");
  }
});

module.exports = {
  initSocket: (io) => {
    ioRef = io;
  }
};
