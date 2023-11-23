const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  role: {
    type: Number, // 1 = admin, 2 = student, 3 = Teacher
    required: false,
    default: 2,
  },
  verified: {
    type: Boolean,
    required: false,
    default: false,
  },
  adminId: {
    type: mongoose.Types.ObjectId,
    ref: "Admin",
    required: false,
  },
  studentId: {
    type: mongoose.Types.ObjectId,
    ref: "students",
    required: false,
  },
  teacherId: {
    type: mongoose.Types.ObjectId,
    ref: "teachers",
    required: false,
  },
  resetPassword: {
    type: Boolean || null,
    required: false,
    default: false,
  },
  resetPasswordToken: {
    type: String || null,
    required: false,
    default: null,
  },
  resetPasswordExpire: {
    type: Date || null,
    required: false,
    default: null,
  },
  emailToken: {
    type: String || null,
    required: false,
    default: null,
  },
  emailTokenExpire: {
    type: Date || null,
    required: false,
    default: null,
  },
});

const AuthModel = mongoose.model("Auth", authSchema);

module.exports = AuthModel;
