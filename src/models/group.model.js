const mongoose = require("mongoose");

const groupSchema = mongoose.Schema({
  groupId: {
    type: String,
  },
  name: {
    type: String,
  },
  teachers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  ],
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
});

module.exports = mongoose.model("Group", groupSchema);
