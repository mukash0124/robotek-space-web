const express = require("express");
const router = express.Router();

const {
  addGroupToTeacher: addGroupToTeacher,
  deleteGroupFromTeacher: deleteGroupFromTeacher,
  teacher: teacher,
  teachers: teachers,
} = require("../controllers/teacher.controller");
const { isAuthenticated, isAdmin } = require("../middlewares/auth.middleware");

router.post("/addGroup", isAuthenticated, isAdmin, addGroupToTeacher);
router.post("/deleteGroup", isAuthenticated, isAdmin, deleteGroupFromTeacher);
router.get("/", isAuthenticated, isAdmin, teachers);
router.get("/:id", isAuthenticated, teacher);

module.exports = router;
