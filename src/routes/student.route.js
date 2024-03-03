const express = require("express");
const router = express.Router();

const {
  student: student,
  students: students,
} = require("../controllers/student.controller");
const { isAuthenticated, isAdmin } = require("../middlewares/auth.middleware");

router.get("/", isAuthenticated, students);
router.get("/:id", isAuthenticated, student);

module.exports = router;
