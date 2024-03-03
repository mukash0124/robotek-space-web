const userModel = require("../models/user.model");
const teacherModel = require("../models/teacher.model");
const studentModel = require("../models/student.model");
const groupModel = require("../models/group.model");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

// Creating new student
const createStudent = (user) => {
  const studentId = uuidv4();
  const student = new studentModel({
    studentId: studentId,
    user: user,
  });
  student.save();
  return student;
};

// Getting all students
const students = asyncHandler(async (req, res) => {
  try {
    const students = await studentModel.find();
    return res.status(200).json({
      data: students,
      sucess: true,
      message: "students list",
    });
  } catch (error) {
    return res.status(401).json({
      sucess: false,
      message: error.message,
    });
  }
});

// Getting one student by id
const student = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const student = await studentModel.findOne({ studentId: id });
    return res.status(200).json({
      data: student,
      sucess: true,
      message: "student info",
    });
  } catch (error) {
    return res.status(401).json({
      sucess: false,
      message: error.message,
    });
  }
});

module.exports = {
  createStudent,
  student,
  students,
};
