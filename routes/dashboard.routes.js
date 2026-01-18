const express = require("express");
const router = express.Router();

// Dashboard
router.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

// Map
router.get("/map", (req, res) => {
  res.render("map");
});

module.exports = router;
