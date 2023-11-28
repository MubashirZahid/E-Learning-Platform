const express = require("express");
const router = express.Router();
const QuestionController = require("../controller/QuestionController");
const { isAuthorized, isAdmin, isTeacher, isStudent } = require("../middleware/userValidation");
// const upload = require("../database/files");

// Create a question
router.post("/api/addQuestion", isAuthorized, isTeacher, QuestionController.addQuestion);

// Get all students
// router.get("/api/getAll", StudentController.getAllStudents);

// Get a student by ID
// router.get("/api/getOne/:id", StudentController.getOneById);

// Delete a question by ID
router.delete(
  "/api/deleteQuestion/:questionId",
  isAuthorized, isTeacher,
  QuestionController.deleteQuestion
);

// Update a book by ID
router.patch(
  "/api/updateQuestion/:questionId",
  QuestionController.updateQuestion
);

module.exports = router;
