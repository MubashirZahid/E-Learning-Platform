const express = require("express");
const router = express.Router();
const CourseController = require("../controller/CourseController");
const { uploadFile } = require("../config/multerconfig");
const { isAuthorized, isAdmin, isTeacher, isStudent } = require("../middleware/userValidation");
// const upload = require("../database/files");

// Create a course
router.post(
  "/api/createCourse",
  uploadFile.single("image"),
  isAuthorized,
  isTeacher,
  CourseController.createCourse
);

// Get all courses
router.get("/api/getAllCourses", CourseController.getAllCourses);

// Get a student by ID
// router.get("/api/getOne/:id", StudentController.getOneById);

// Delete a course by ID
router.delete("/api/deleteCourse/:courseId",isAuthorized, isTeacher, CourseController.deleteCourse);

// Update a quiz by ID
router.patch(
  "/api/updateCourse/:courseId",
  uploadFile.single("image"),
  isAuthorized, isTeacher,
  CourseController.partialUpdateById
);

router.post(
  "/api/publishCourse/",
  isAuthorized, isTeacher,
  CourseController.requestToPublish
);
router.post(
  "/api/acceptCourse/",
  isAuthorized, isAdmin,
  CourseController.acceptCourse
);

module.exports = router;
