const express = require("express");
const router = express.Router();

const {
    getAboutContent,
    updateAboutContent,
} = require("../controllers/aboutContent.controller");

const { protect, adminOnly } = require("../middleware/auth.middleware");

// Public: Get about content
router.get("/", getAboutContent);

// Admin: Update about content
router.put("/", protect, adminOnly, updateAboutContent);

module.exports = router;
