const express = require("express");
const router = express.Router();
const QuizController = require("../controller/QuizController");
const { isAuthorized, isAdmin, isTeacher, isStudent } = require("../middleware/userValidation");

// const upload = require("../database/files");

// Create a quiz
router.post("/api/addQuiz", isAuthorized, isTeacher, QuizController.addQuiz);

// Get all students
// router.get("/api/getAll", StudentController.getAllStudents);

// Get a student by ID
// router.get("/api/getOne/:id", StudentController.getOneById);

// Delete a quiz by ID
router.delete("/api/deleteQuiz/:quizId", isAuthorized, isTeacher, QuizController.deleteQuiz);

// Update a quiz by ID
router.patch("/api/updateQuiz/:quizId", isAuthorized, isTeacher, QuizController.updateQuestion);

module.exports = router;
