const express = require("express");
const router = express.Router();

const {
  createGroup,
  addStudentToGroup,
  deleteStudentFromGroup,
  group,
  groups,
} = require("../controllers/group.controller");
const { isAuthenticated, isAdmin } = require("../middlewares/auth.middleware");

router.post("/create", isAuthenticated, isAdmin, createGroup);
router.post("/addStudent", isAuthenticated, isAdmin, addStudentToGroup);
router.post("/deleteStudent", isAuthenticated, isAdmin, deleteStudentFromGroup);
router.get("/", isAuthenticated, isAdmin, groups);
router.get("/:id", isAuthenticated, group);

module.exports = router;
