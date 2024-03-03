const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userId: {
    type: String,
  },
  fullName: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  role: {
    type: String,
    enum: ["admin", "teacher", "student"],
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
});

module.exports = mongoose.model("User", userSchema);
