const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const {
  getMessages,
  postMessage,
  updateMessage,
  deleteMessage,
  toggleDiscussionStatus,
  getDiscussionSettings,
} = require("../controllers/discussion.controller");

/* -------------------- PUBLIC ROUTES -------------------- */

// Get all discussion messages
router.get("/", protect, getMessages);

// Get discussion settings
router.get("/settings", getDiscussionSettings);

/* -------------------- AUTHENTICATED ROUTES -------------------- */

// Enable / disable discussion room (Specific route first)
router.put(
  "/toggle",
  protect,
  adminOnly,
  toggleDiscussionStatus
);

// Post a message (student or admin)
router.post(
  "/",
  protect,
  upload.single("image"),
  postMessage
);

router.put(
  "/:id",
  protect,
  updateMessage
);

router.delete(
  "/:id",
  protect,
  deleteMessage
);

module.exports = router;
