const express = require("express");
const router = express.Router();
const LectureController = require("../controller/LectureController");
const upload = require("multer")();
// const { isAdmin } = require("../middleware/authValidation");
// const upload = require("../database/files");

// Create Lecture
router.post(
  "/api/createLecture",
  upload.single("videoUrl"),
  LectureController.createLecture
);

// Delete Lecture
router.delete("/api/deleteLecture/:lectureId", LectureController.deleteLecture);

module.exports = router;
