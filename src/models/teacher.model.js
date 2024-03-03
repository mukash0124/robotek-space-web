const mongoose = require("mongoose");

const teacherSchema = mongoose.Schema({
  teacherId: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
  ],
});

module.exports = mongoose.model("Teacher", teacherSchema);
