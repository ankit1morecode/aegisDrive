const socket = io();
const vehicleId = window.location.pathname.split("/").pop();

socket.on("vehicle_update", (data) => {
  if (data.vehicleId !== vehicleId) return;

  document.getElementById("temp").innerText = data.temperature;
  document.getElementById("humidity").innerText = data.humidity;
  document.getElementById("gas").innerText = data.gas;
  document.getElementById("vibration").innerText = data.vibration;

  document.getElementById("healthScore").innerText = data.health + "%";
  document.getElementById("lastSync").innerText = "Just now";
});

fetch(`/api/telemetry/${vehicleId}`)
  .then(res => res.json())
  .then(data => {
    const labels = data.map(d => new Date(d.createdAt).toLocaleTimeString());
    const temps = data.map(d => d.temperature);

    new Chart(document.getElementById("tempChart"), {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Temperature (°C)",
          data: temps,
          fill: false,
          tension: 0.3
        }]
      }
    });
  });

