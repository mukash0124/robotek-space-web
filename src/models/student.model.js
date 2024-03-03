const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
  studentId: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    default: undefined,
  },
});

module.exports = mongoose.model("Student", studentSchema);
