const express = require("express");
const router = express.Router();
const ReviewController = require("../controller/ReviewController");

const { isAuthorized, isAdmin, isTeacher, isStudent } = require("../middleware/userValidation");
// const upload = require("../database/files");

// Create a review
router.post("/api/addToReview",isAuthorized, isStudent, ReviewController.addToReview);

// Update rating, review
router.patch("/api/updateReview", isAuthorized, isStudent, ReviewController.updateReview);

// Remove review
router.delete("/api/removeReview", isAuthorized, isStudent, ReviewController.removeReview);

module.exports = router;
