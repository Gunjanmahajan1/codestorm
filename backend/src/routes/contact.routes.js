const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/auth.middleware");

const {
  getContact,
  updateContact,
} = require("../controllers/contact.controller");

/* -------------------- PUBLIC ROUTES -------------------- */

// Get contact & social links
router.get("/", getContact);

/* -------------------- ADMIN ROUTES -------------------- */

// Update contact & social links
router.put(
  "/",
  protect,
  adminOnly,
  updateContact
);

module.exports = router;
