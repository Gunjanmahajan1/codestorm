const express = require("express");
const router = express.Router();

const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  togglePublishEvent,
  getPublishedEvents,
  uploadEventImage,
} = require("../controllers/event.controller");

const { protect, adminOnly } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

/* -------------------- STUDENT ROUTES -------------------- */

// Student-only published events
router.get("/public", getPublishedEvents);

// Get single event by ID (published or admin)
router.get("/:id", getEventById);

/* -------------------- ADMIN ROUTES -------------------- */

// Admin sees all events
router.get("/", protect, adminOnly, getAllEvents);

// Create event
router.post("/", protect, adminOnly, createEvent);

// Update event
router.put("/:id", protect, adminOnly, updateEvent);

// Delete event
router.delete("/:id", protect, adminOnly, deleteEvent);

// Publish / Unpublish
router.patch("/:id/publish", protect, adminOnly, togglePublishEvent);

// Upload event image
router.post(
  "/:id/image",
  protect,
  adminOnly,
  upload.single("image"),
  uploadEventImage
);

module.exports = router;
