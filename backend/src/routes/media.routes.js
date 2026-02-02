const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

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
  roleMiddleware("admin"),
  uploadMedia
);

// Delete media
router.delete(
  "/:id",
  protect,
  roleMiddleware("admin"),
  deleteMedia
);

module.exports = router;
