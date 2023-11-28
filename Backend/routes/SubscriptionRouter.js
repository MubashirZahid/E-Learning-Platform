const express = require("express");
const router = express.Router();
const SubscriptionController = require("../controller/SubscriptionController");

const { isAuthorized, isAdmin, isTeacher, isStudent } = require("../middleware/userValidation");

// const upload = require("../database/files");

// Create a subscription
router.post(
  "/api/requestToSubscribe",
  isAuthorized, isStudent,
  SubscriptionController.requestToSubscribe
);

// Create a subscription
router.post(
  "/api/createSubscription",
  isAuthorized, isStudent,
  SubscriptionController.addToSubscription
);

router.get(
  "/api/studentCourseList/:studentId",
  isAuthorized, isStudent,
  SubscriptionController.studentCourseList
);

// Remove from subscription
router.delete(
  "/api/removeFromSubscription",
  isAuthorized, isStudent,
  SubscriptionController.removeFromSubscription
);

module.exports = router;
