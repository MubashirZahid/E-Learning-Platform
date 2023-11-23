const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },

  phone: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  verified: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const TeacherModel = mongoose.model("teachers", teacherSchema);

module.exports = TeacherModel;
