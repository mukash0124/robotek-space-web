const mongoose = require("mongoose");

const teacherSchema = mongoose.Schema({
  printId: {
    type: String,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  lesson: {
    type: Number,
  },
  reason: {
    type: String,
    enum: ["attendance", "homework", "sotring", "extra"],
  },
});

module.exports = mongoose.model("Teacher", teacherSchema);
