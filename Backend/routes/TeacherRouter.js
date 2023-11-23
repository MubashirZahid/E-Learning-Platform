const express = require("express");
const router = express.Router();
const TeacherController = require("../controller/TeacherController");
// const { isAdmin } = require("../middleware/authValidation");
// const upload = require("../database/files");

// Get all teachers
router.get("/api/getAll", TeacherController.getAll);

// Get a teacher by id
router.get("/api/getOne/:id", TeacherController.getOneByID);

// Delete a student by ID
router.delete("/api/delete/:id", TeacherController.deleteOneById);

// Update a book by ID
router.patch("/api/update/:id", TeacherController.partialUpdateByID);

module.exports = router;
