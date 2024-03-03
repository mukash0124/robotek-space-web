const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const { createTeacher: createTeacher } = require("./teacher.controller");
const { createStudent: createStudent } = require("./student.controller");
const { messages } = require("validatorjs/src/lang");

// Registering new user
const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, phoneNumber, role } = req.body;

  const verifyEmail = await userModel.findOne({ email: email });
  try {
    if (verifyEmail) {
      return res.status(403).json({
        message: "Email already used",
      });
    } else {
      const userId = uuidv4();
      bcrypt.hash(req.body.password, 10).then((hash) => {
        const user = new userModel({
          userId: userId,
          fullName: fullName,
          email: email,
          password: hash,
          phoneNumber: phoneNumber,
          role: role,
        });
        if (role == "teacher") {
          user.teacher = createTeacher(user);
        }
        if (role == "student") {
          user.student = createStudent(user);
        }
        user
          .save()
          .then((response) => {
            if (user.role == "teacher") {
              response.teacher = response.teacher._id;
            }
            if (user.role == "student") {
              response.student = response.student._id;
            }
            return res.status(201).json({
              message: "user successfully created!",
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
      });
    }
  } catch (error) {
    return res.status(412).send({
      success: false,
      message: error.message,
    });
  }
});

// Logging in user
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  let getUser;

  userModel
    .findOne({
      email: email,
    })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Authentication Failed",
        });
      }
      getUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((response) => {
      if (!response) {
        return res.status(401).json({
          message: "Authentication Failed",
        });
      } else {
        let jwtToken = jwt.sign(
          {
            email: getUser.email,
            userId: getUser.userId,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        return res.status(200).json({
          accessToken: jwtToken,
          userId: getUser.userId,
        });
      }
    })
    .catch((err) => {
      return res.status(401).json({
        message: err.message,
        success: false,
      });
    });
});

// Getting one user by id
const userProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    const verifyUser = await userModel.findOne({ userId: id });
    if (!verifyUser) {
      return res.status(403).json({
        success: false,
        message: "user not found",
      });
    } else {
      return res.status(200).json({
        data: verifyUser,
        message: `user info`,
        success: true,
      });
    }
  } catch (error) {
    return res.status(401).json({
      sucess: false,
      message: error.message,
    });
  }
});

// Getting all teachers
const users = asyncHandler(async (req, res) => {
  try {
    const users = await userModel.find();
    return res.status(200).json({
      data: users,
      sucess: true,
      message: "users list",
    });
  } catch (error) {
    return res.status(401).json({
      sucess: false,
      message: error.message,
    });
  }
});

module.exports = {
  register,
  login,
  userProfile,
  users,
};
