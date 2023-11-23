const express = require("express");
const router = express.Router();
const AuthController = require("../controller/AuthController");
const { authValidator } = require("../middleware/authValidator");

router.post("/api/signUp", authValidator.signUp, AuthController.signUp);
router.post("/api/verify-user", AuthController.verifyUser);

router.post("/api/logIn", authValidator.logIn, AuthController.logIn);

router.post("/api/send-email", AuthController.sendForgotPasswordEmail);
router.post("/api/reset-password", AuthController.resetPassword);

module.exports = router;
