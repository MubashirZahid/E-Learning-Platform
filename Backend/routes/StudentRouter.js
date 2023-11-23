const express = require("express");
const router = express.Router();
const StudentController = require("../controller/StudentController");
// const { isAdmin } = require("../middleware/authValidation");
// const upload = require("../database/files");

// Get all students
router.get("/api/getAll", StudentController.getAllStudents);

// Get a student by ID
router.get("/api/getOne/:id", StudentController.getOneById);

// Delete a student by ID
router.delete("/api/delete/:id", StudentController.deleteById);

// Update a book by ID
router.patch("/api/update/:id", StudentController.updateById);

module.exports = router;
