const express = require("express");
const router = express.Router();
const AssignmentController = require("../controller/AssignmentController");
// const { isAdmin } = require("../middleware/authValidation");
// const upload = require("../database/files");

// Create a quiz
router.post("/api/createAssignment", AssignmentController.createAssignment);

// Get all students
// router.get("/api/getAll", StudentController.getAllStudents);

// Get a student by ID
// router.get("/api/getOne/:id", StudentController.getOneById);

// Delete a quiz by ID
router.delete(
  "/api/deleteAssignment/:assignmentId",
  AssignmentController.deleteAssignment
);

// Update a quiz by ID
// router.patch("/api/updateQuiz/:quizId", QuizController.updateQuestion);

module.exports = router;
