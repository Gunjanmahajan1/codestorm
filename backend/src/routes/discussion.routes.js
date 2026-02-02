const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const {
  getMessages,
  postMessage,
  toggleDiscussionStatus,
} = require("../controllers/discussion.controller");

/* -------------------- PUBLIC ROUTES -------------------- */

// Get all discussion messages
router.get("/", getMessages);

/* -------------------- AUTHENTICATED ROUTES -------------------- */

// Post a message (student or admin)
router.post(
  "/",
  protect,
  postMessage
);

/* -------------------- ADMIN ROUTES -------------------- */

// Enable / disable discussion room
router.put(
  "/toggle",
  protect,
  roleMiddleware("admin"),
  toggleDiscussionStatus
);

module.exports = router;
