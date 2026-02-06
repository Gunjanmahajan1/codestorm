const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/auth.middleware");

const {
  uploadMedia,
  getAllMedia,
  deleteMedia,
} = require("../controllers/media.controller");

/* -------------------- PUBLIC ROUTES -------------------- */

// Get all media (gallery)
router.get("/", getAllMedia);

/* -------------------- ADMIN ROUTES -------------------- */

// Upload media (image/video)
router.post(
  "/",
  protect,
  adminOnly,
  uploadMedia
);

// Delete media
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteMedia
);

module.exports = router;
