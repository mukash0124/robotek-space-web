const userModel = require("../models/user.model");
const teacherModel = require("../models/teacher.model");
const groupModel = require("../models/group.model");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

// Creating new teacher
const createTeacher = (user) => {
  const teacherId = uuidv4();
  const teacher = new teacherModel({
    teacherId: teacherId,
    user: user,
  });
  teacher.save();
  return teacher;
};

// Adding group to the teacher
const addGroupToTeacher = asyncHandler(async (req, res) => {
  const { userId, groupId } = req.body;

  try {
    const verifyUser = await userModel
      .findOne({
        userId: userId,
      })
      .populate("teacher");
    const verifyGroup = await groupModel.findOne({ groupId: groupId });
    const verifyTeacher = await teacherModel.findOne({ user: verifyUser });
    if (!verifyUser) {
      return res.status(403).json({
        message: "user not found",
        success: false,
      });
    }
    if (!verifyGroup) {
      return res.status(403).json({
        message: "group not found",
        success: false,
      });
    }
    if (!verifyTeacher) {
      return res.status(403).json({
        message: "user is not a teacher",
        success: false,
      });
    }
    if (verifyUser.teacher.groups) {
      const verifyGroupInGroups = verifyTeacher.groups.some((element) => {
        return element.equals(verifyGroup._id);
      });
      if (verifyGroupInGroups) {
        return res.status(403).json({
          message: "teacher is already teaching this group",
          success: false,
        });
      }
    }
    teacherModel
      .updateOne(verifyTeacher, { $push: { groups: verifyGroup } })
      .catch((err) => {
        return res.status(500).json({
          message: "something went wrong while updating teacher",
          success: false,
        });
      });
    groupModel
      .updateOne(verifyGroup, { $push: { teachers: verifyTeacher } })
      .catch((err) => {
        return res.status(500).json({
          message: "something went wrong while updating group",
          success: false,
        });
      });
    return res.status(200).json({
      sucess: true,
      message: "group has been successfully attached to the teacher",
    });
  } catch (error) {
    return res.status(401).json({
      sucess: false,
      message: error.message,
    });
  }
});

// Deleting group from the teacher
const deleteGroupFromTeacher = asyncHandler(async (req, res) => {
  const { userId, groupId } = req.body;

  try {
    const verifyUser = await userModel
      .findOne({
        userId: userId,
      })
      .populate("teacher");
    const verifyGroup = await groupModel.findOne({ groupId: groupId });
    const verifyTeacher = await teacherModel.findOne({ user: verifyUser });
    if (!verifyUser) {
      return res.status(403).json({
        message: "user not found",
        success: false,
      });
    }
    if (!verifyGroup) {
      return res.status(403).json({
        message: "group not found",
        success: false,
      });
    }
    if (!verifyTeacher) {
      return res.status(403).json({
        message: "user is not a teacher",
        success: false,
      });
    }
    if (!verifyTeacher.groups) {
      return res.status(403).json({
        message: "teacher is not teaching this group",
        success: false,
      });
    } else {
      const verifyGroupInGroups = verifyTeacher.groups.some((element) => {
        return element.equals(verifyGroup._id);
      });
      if (!verifyGroupInGroups) {
        return res.status(403).json({
          message: "teacher is not teaching this group",
          success: false,
        });
      }
    }
    console.log(verifyTeacher);
    console.log(verifyGroup);
    teacherModel
      .updateOne(verifyTeacher, { $pull: { groups: verifyGroup._id } })
      .catch((err) => {
        return res.status(500).json({
          message: "something went wrong while updating teacher",
          success: false,
        });
      });
    groupModel
      .updateOne(verifyGroup, { $pull: { teachers: verifyTeacher._id } })
      .catch((err) => {
        return res.status(500).json({
          message: "something went wrong while updating group",
          success: false,
        });
      });
    return res.status(200).json({
      sucess: true,
      message: "group has been successfully attached to the teacher",
    });
  } catch (error) {
    return res.status(401).json({
      sucess: false,
      message: error.message,
    });
  }
});

// Getting all teachers
const teachers = asyncHandler(async (req, res) => {
  try {
    const teachers = await teacherModel.find();
    return res.status(200).json({
      data: teachers,
      sucess: true,
      message: "teachers list",
    });
  } catch (error) {
    return res.status(401).json({
      sucess: false,
      message: error.message,
    });
  }
});

// Getting one teacher by id
const teacher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const teacher = await teacherModel.findOne({ teacherId: id });
    return res.status(200).json({
      data: teacher,
      sucess: true,
      message: "teacher info",
    });
  } catch (error) {
    return res.status(401).json({
      sucess: false,
      message: error.message,
    });
  }
});

module.exports = {
  createTeacher,
  addGroupToTeacher,
  deleteGroupFromTeacher,
  teacher,
  teachers,
};
