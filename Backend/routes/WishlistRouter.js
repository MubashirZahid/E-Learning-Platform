const express = require("express");
const router = express.Router();
const WishlistController = require("../controller/WishlistController");

const { isAuthorized, isAdmin, isTeacher, isStudent } = require("../middleware/userValidation");

// const upload = require("../database/files");

// Create a wishlist
router.post("/api/createWishlist", isAuthorized, isStudent, WishlistController.addToWishlist);

// Remove from wishlist
router.delete("/api/removeFromWishlist", isAuthorized, isStudent, WishlistController.removeFromWishlist);

module.exports = router;
