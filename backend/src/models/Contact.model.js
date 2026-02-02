const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    email: { type: String },
    linkedin: { type: String },
    instagram: { type: String },
    whatsapp: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
