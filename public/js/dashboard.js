const socket = io();

socket.on("fleet_update", (data) => {
  document.getElementById("activeVehicles").innerText = data.active;
  document.getElementById("riskVehicles").innerText = data.risk;
  document.getElementById("serviceDue").innerText = data.service;
  document.getElementById("greenScore").innerText = data.green + "%";
});