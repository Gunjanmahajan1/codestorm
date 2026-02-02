const express = require("express");
const router = express.Router();

const {
  getContact,
  updateContact,
} = require("../controllers/contact.controller");

// ⚠️ IMPORTANT:
// Use the SAME middleware pattern already working in your project
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

/* ---------------- PUBLIC ROUTE ---------------- */

// Students / public
router.get("/", getContact);

/* ---------------- ADMIN ROUTE ---------------- */

// Admin only
router.put(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  updateContact
);

module.exports = router;
