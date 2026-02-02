const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

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
  roleMiddleware("admin"),
  updateContact
);

module.exports = router;
