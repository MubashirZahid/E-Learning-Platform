const express = require("express");
const router = express.Router();
const SubscriptionController = require("../controller/SubscriptionController");

// const { isAdmin } = require("../middleware/authValidation");
// const upload = require("../database/files");

// Create a subscription
router.post(
  "/api/requestToSubscribe",
  SubscriptionController.requestToSubscribe
);

// Create a subscription
router.post(
  "/api/createSubscription",
  SubscriptionController.addToSubscription
);

// Remove from subscription
router.delete(
  "/api/removeFromSubscription",
  SubscriptionController.removeFromSubscription
);

module.exports = router;
