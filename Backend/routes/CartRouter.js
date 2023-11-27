const express = require("express");
const router = express.Router();
const CartController = require("../controller/CartController");

// const { isAdmin } = require("../middleware/authValidation");
// const upload = require("../database/files");

// Create a cart
router.post("/api/createCart", CartController.addToCart);

// Get All Cart
router.get("/api/studentCartList/:studentId", CartController.studentCartList);

// Remove from cart
router.delete("/api/removeFromCart", CartController.removeFromCart);

module.exports = router;
