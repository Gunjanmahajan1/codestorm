const mongoose = require("mongoose");

const socialSchema = new mongoose.Schema({
  email: { type: String, required: true },
  linkedin: { type: String, required: true },
  instagram: { type: String, required: true },
  whatsapp: { type: String, required: true },
});

module.exports = mongoose.model("Social", socialSchema);
