const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "authentification Failed",
    });
  }
};

const isAdmin = async (req, res, next) => {
  const verifyUser = await userModel.findOne({ userId: req.userData.userId });
  console.log(req.userData.userId);
  if (!verifyUser) {
    return res.status(403).json({
      message: "user not found",
      success: false,
    });
  }
  if (verifyUser.role == "admin") {
    next();
    return;
  }

  res.status(403).send({ message: "Require Admin Role!" });
  return;
};

module.exports = { isAuthenticated, isAdmin };
