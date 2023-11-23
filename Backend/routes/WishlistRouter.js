const express = require("express");
const router = express.Router();
const WishlistController = require("../controller/WishlistController");

// const { isAdmin } = require("../middleware/authValidation");
// const upload = require("../database/files");

// Create a wishlist
router.post("/api/createWishlist", WishlistController.addToWishlist);

// Remove from wishlist
router.delete("/api/removeFromWishlist", WishlistController.removeFromWishlist);

module.exports = router;
