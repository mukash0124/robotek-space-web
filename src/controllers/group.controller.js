const userModel = require("../models/user.model");
const groupModel = require("../models/group.model");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const studentModel = require("../models/student.model");

// Creating new group
const createGroup = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const verifyName = await groupModel.findOne({ name: name });
  try {
    if (verifyName) {
      return res.status(403).json({
        message: "name already used",
      });
    } else {
      const groupId = uuidv4();
      const group = new groupModel({
        groupId: groupId,
        name: name,
      });
      group
        .save()
        .then((response) => {
          return res.status(201).json({
            message: "group successfully created!",
            result: response,
            success: true,
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({
            error: error,
          });
        });
    }
  } catch (error) {
    return res.status(412).send({
      success: false,
      message: error.message,
    });
  }
});

// Adding student to the group
const addStudentToGroup = asyncHandler(async (req, res) => {
  const { userId, groupId } = req.body;

  try {
    const verifyUser = await userModel
      .findOne({
        userId: userId,
      })
      .populate("teacher");
    const verifyGroup = await groupModel.findOne({ groupId: groupId });
    const verifyStudent = await studentModel.findOne({ user: verifyUser });
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
    if (!verifyStudent) {
      return res.status(403).json({
        message: "user is not a student",
        success: false,
      });
    }
    const verifyStudentInGroup = verifyStudent.group.equals(verifyGroup._id);
    if (verifyStudentInGroup) {
      return res.status(403).json({
        message: "student is already added to this group",
        success: false,
      });
    }
    studentModel
      .updateOne(verifyStudent, {
        group: verifyGroup,
      })
      .catch((err) => {
        console.log(error);
        return res.status(500).json({
          message: "something went wrong while updating student",
          success: false,
        });
      });
    groupModel
      .updateOne(verifyGroup, {
        $push: { students: verifyStudent },
      })
      .catch((err) => {
        console.log(error);
        return res.status(500).json({
          message: "something went wrong while updating group",
          success: false,
        });
      });
    return res.status(200).json({
      sucess: true,
      message: "student has been successfully added to the group",
    });
  } catch (error) {
    return res.status(401).json({
      sucess: false,
      message: error.message,
    });
  }
});

// Deleting student from the group
const deleteStudentFromGroup = asyncHandler(async (req, res) => {
  const { userId, groupId } = req.body;

  try {
    const verifyUser = await userModel
      .findOne({
        userId: userId,
      })
      .populate("student");
    const verifyGroup = await groupModel.findOne({ groupId: groupId });
    const verifyStudent = await studentModel.findOne({ user: verifyUser });
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
    if (!verifyStudent) {
      return res.status(403).json({
        message: "user is not a student",
        success: false,
      });
    }
    const verifyStudentInGroup = verifyStudent.group.equals(verifyGroup._id);
    if (!verifyStudentInGroup) {
      return res.status(403).json({
        message: "student is not added to this group",
        success: false,
      });
    }
    studentModel
      .updateOne(verifyStudent, {
        group: undefined,
      })
      .catch((err) => {
        return res.status(500).json({
          message: "something went wrong while updating student",
          success: false,
        });
      });
    groupModel
      .updateOne(verifyGroup, {
        $pull: { students: verifyStudent._id },
      })
      .catch((err) => {
        return res.status(500).json({
          message: "something went wrong while updating group",
          success: false,
        });
      });
    return res.status(200).json({
      sucess: true,
      message: "group has been successfully deleted from the teacher",
    });
  } catch (error) {
    return res.status(401).json({
      sucess: false,
      message: error.message,
    });
  }
});

// Getting all groups
const groups = asyncHandler(async (req, res) => {
  try {
    const groups = await groupModel.find();
    return res.status(200).json({
      data: groups,
      sucess: true,
      message: "groups list",
    });
  } catch (error) {
    return res.status(401).json({
      sucess: false,
      message: error.message,
    });
  }
});

// Getting one group by id
const group = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const group = await groupModel.findOne({ groupId: id });
    return res.status(200).json({
      data: group,
      sucess: true,
      message: "group info",
    });
  } catch (error) {
    return res.status(401).json({
      sucess: false,
      message: error.message,
    });
  }
});

module.exports = {
  createGroup,
  addStudentToGroup,
  deleteStudentFromGroup,
  group,
  groups,
};
