const express = require("express");
const router = express.Router();
const CourseController = require("../controller/CourseController");
const { uploadFile } = require("../config/multerconfig");
// const { isAdmin } = require("../middleware/authValidation");
// const upload = require("../database/files");

// Create a course
router.post(
  "/api/createCourse",
  uploadFile.single("image"),
  CourseController.createCourse
);

// Get all students
router.get("/api/getAllCourses", CourseController.getAllCourses);

// Get a student by ID
// router.get("/api/getOne/:id", StudentController.getOneById);

// Delete a quiz by ID
router.delete("/api/deleteCourse/:courseId", CourseController.deleteCourse);

// Update a quiz by ID
router.patch(
  "/api/updateCourse/:courseId",
  uploadFile.single("image"),
  CourseController.partialUpdateById
);

router.post(
  "/api/publishCourse/",

  CourseController.requestToPublish
);
router.post(
  "/api/acceptCourse/",

  CourseController.acceptCourse
);

module.exports = router;
