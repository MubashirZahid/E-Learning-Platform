const express = require("express");
const router = express.Router();
const TeacherController = require("../controller/TeacherController");
const { isAuthorized, isAdmin, isTeacher, isStudent } = require("../middleware/userValidation");

// const upload = require("../database/files");

// Get all teachers
router.get("/api/getAll", isAuthorized, isAdmin, TeacherController.getAll);

// Get a teacher by id
router.get("/api/getOne/:id", isAuthorized, isAdmin, TeacherController.getOneByID);

// Delete a student by ID
router.delete("/api/delete/:id", isAuthorized, isAdmin, TeacherController.deleteOneById);

// Update a book by ID
router.patch("/api/update/:id", isAuthorized, isTeacher, TeacherController.partialUpdateByID);

module.exports = router;
