const mongoose = require("mongoose");

const discussionSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Discussion", discussionSchema);
