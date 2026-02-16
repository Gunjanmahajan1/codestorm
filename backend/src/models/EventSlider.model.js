const mongoose = require("mongoose");

const eventSliderSchema = new mongoose.Schema(
    {
        imageUrl: {
            type: String,
            required: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("EventSlider", eventSliderSchema);
