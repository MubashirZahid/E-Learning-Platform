const express = require("express");
const router = express.Router();
const CartController = require("../controller/CartController");

const { isAuthorized, isAdmin, isTeacher, isStudent } = require("../middleware/userValidation");

// const upload = require("../database/files");

// Create a cart
router.post("/api/createCart",isAuthorized, isStudent, CartController.addToCart);

// Get All Cart
router.get("/api/studentCartList/:studentId", isAuthorized, isStudent, CartController.studentCartList);

// Remove from cart
router.delete("/api/removeFromCart", isAuthorized, isStudent, CartController.removeFromCart);

module.exports = router;
