const socket = io();

socket.on("vehicle_update", (data) => {
  document.getElementById("vId").innerText = data.vehicleId;
  document.getElementById("temp").innerText = data.temperature;
  document.getElementById("humidity").innerText = data.humidity;
  document.getElementById("gas").innerText = data.gas;
  document.getElementById("vibration").innerText = data.vibration;
});

socket.on("telemetry_raw", (data) => {
  document.getElementById("raw").innerText =
    JSON.stringify(data, null, 2);
});
