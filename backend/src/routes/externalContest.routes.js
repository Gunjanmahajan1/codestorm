const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const r = await axios.get("https://www.google.com");
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({
      success: false,
      error: e.message,
    });
  }
});

module.exports = router;
