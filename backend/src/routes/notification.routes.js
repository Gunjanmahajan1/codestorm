const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const { protect } = require("../middleware/auth.middleware");

router.get("/public-key", protect, notificationController.getPublicKey);
router.post("/subscribe", protect, notificationController.subscribe);
router.post("/unsubscribe", protect, notificationController.unsubscribe);
router.post("/send-all", protect, notificationController.sendToAll);

module.exports = router;

