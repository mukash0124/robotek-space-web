const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", req.query);
});

router.get("/login", (req, res) => {
  res.render("login", req.query);
});

router.get("/dashboard", (req, res) => {
  res.render("dashboard", req.query);
});

router.get("/dashboard_admin", (req, res) => {
  res.render("dashboard_admin", req.query);
});

router.get("/dashboard_student", (req, res) => {
  res.render("dashboard_student", req.query);
});

module.exports = router;
