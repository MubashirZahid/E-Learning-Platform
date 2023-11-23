const express = require("express");
const router = express.Router();
const ReviewController = require("../controller/ReviewController");

// const { isAdmin } = require("../middleware/authValidation");
// const upload = require("../database/files");

// Create a review
router.post("/api/addToReview", ReviewController.addToReview);

// Update rating, review
router.patch("/api/updateReview", ReviewController.updateReview);

// Remove from subscription
router.delete("/api/removeReview", ReviewController.removeReview);

module.exports = router;
