const express = require("express");
const router = express.Router();
const StudentController = require("../controller/StudentController");
const { isAuthorized, isAdmin, isTeacher, isStudent } = require("../middleware/userValidation");

// const upload = require("../database/files");

// Get all students
router.get("/api/getAll", isAuthorized, isAdmin, StudentController.getAllStudents);

// Get a student by ID
router.get("/api/getOne/:id", isAuthorized, isAdmin, StudentController.getOneById);

// Delete a student by ID
router.delete("/api/delete/:id", isAuthorized, isAdmin, StudentController.deleteById);

// Update a student by ID
router.patch("/api/update/:id", isAuthorized, isStudent, StudentController.updateById);

module.exports = router;
