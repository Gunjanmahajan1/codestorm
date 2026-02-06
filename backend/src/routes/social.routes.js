const express = require("express");
const router = express.Router();

const {
  getSocialLinks,
  updateSocialLinks,
} = require("../controllers/social.controller");

const {
  protect,
  adminOnly,
} = require("../middleware/auth.middleware");



router.get("/", getSocialLinks);
router.put("/", protect, adminOnly, updateSocialLinks);

module.exports = router;
