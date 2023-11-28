const express = require("express");
const router = express.Router();
const LectureController = require("../controller/LectureController");
const upload = require("multer")();
const { isAuthorized, isAdmin, isTeacher, isStudent } = require("../middleware/userValidation");
// const upload = require("../database/files");

// Create Lecture
router.post(
  "/api/createLecture",
  upload.single("videoUrl"),
  isAuthorized, isTeacher,
  LectureController.createLecture
);

// Delete Lecture
router.delete("/api/deleteLecture/:lectureId", isAuthorized, isTeacher, LectureController.deleteLecture);

module.exports = router;
