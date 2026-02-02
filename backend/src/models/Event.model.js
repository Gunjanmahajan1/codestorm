const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    eventType: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    location: {
      type: String,
      default: "Online",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublished: {
  type: Boolean,
  default: true,
},
image: {
  type: String,
  default: "",
},

  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("Event", eventSchema);
