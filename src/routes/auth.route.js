const express = require("express");
const router = express.Router();

const {
  regsiterValidation,
  loginValidation,
} = require("../middlewares/authvalidation.middleware");
const {
  login,
  register,
  userProfile,
  users,
} = require("../controllers/auth.controller");
const {
  isAuthenticated: isAuthenticated,
} = require("../middlewares/auth.middleware");

router.post("/register", regsiterValidation, register);
router.post("/login", loginValidation, login);
router.get("/:id", isAuthenticated, userProfile);
router.get("/", isAuthenticated, users);

module.exports = router;
