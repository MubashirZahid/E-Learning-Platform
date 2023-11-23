const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
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

const StudentModel = mongoose.model("students", studentSchema);

module.exports = StudentModel;
