const Social = require("../models/Social.model");

// GET social links (public)
const getSocialLinks = async (req, res) => {
  try {
    const data = await Social.findOne();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch social links" });
  }
};

// UPDATE social links (admin only)
const updateSocialLinks = async (req, res) => {
  try {
    const updated = await Social.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update social links" });
  }
};

module.exports = {
  getSocialLinks,
  updateSocialLinks,
};
