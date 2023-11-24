const express = require("express");
const router = express.Router();
const SectionController = require("../controller/SectionController");
// const { uploadFile } = require("../config/multerconfig");
// const { isAdmin } = require("../middleware/authValidation");
// const upload = require("../database/files");

// Create a course
router.post("/api/createSection", SectionController.createSection);

// Get all students
// router.get("/api/getAllCourses", CourseController.getAllCourses);

// Get a student by ID
// router.get("/api/getOne/:id", StudentController.getOneById);

// Delete a quiz by ID
// router.delete("/api/deleteCourse/:courseId", CourseController.deleteCourse);

// Update a quiz by ID
router.patch("/api/updateSection/:sectionId", SectionController.updateSection);

module.exports = router;
