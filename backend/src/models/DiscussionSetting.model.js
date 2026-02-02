const mongoose = require("mongoose");

const discussionSettingSchema = new mongoose.Schema(
  {
    isEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "DiscussionSetting",
  discussionSettingSchema
);
