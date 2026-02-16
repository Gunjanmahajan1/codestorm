const mongoose = require("mongoose");

const discussionSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: false, // Changed to false because a message can be just an image
      trim: true,
      maxlength: 1000,
    },

    image: {
      type: String,
      required: false,
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
