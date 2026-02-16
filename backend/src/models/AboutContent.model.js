const mongoose = require("mongoose");

const aboutContentSchema = new mongoose.Schema(
    {
        committeeTitle: {
            type: String,
            default: "Core Committee 2025-26",
            trim: true,
        },
        // We can add more fields later if needed
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("AboutContent", aboutContentSchema);
