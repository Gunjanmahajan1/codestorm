const AboutContent = require("../models/AboutContent.model");

/* -------------------- GET ABOUT CONTENT -------------------- */
exports.getAboutContent = async (req, res, next) => {
    try {
        let content = await AboutContent.findOne();

        // If no content exists, create a default one
        if (!content) {
            content = await AboutContent.create({
                committeeTitle: "Core Committee 2025-26"
            });
        }

        res.status(200).json({
            success: true,
            data: content,
        });
    } catch (error) {
        next(error);
    }
};

/* -------------------- UPDATE ABOUT CONTENT -------------------- */
exports.updateAboutContent = async (req, res, next) => {
    try {
        const { committeeTitle } = req.body;

        let content = await AboutContent.findOne();

        if (!content) {
            content = await AboutContent.create({ committeeTitle });
        } else {
            content.committeeTitle = committeeTitle;
            await content.save();
        }

        res.status(200).json({
            success: true,
            message: "About content updated successfully",
            data: content,
        });
    } catch (error) {
        next(error);
    }
};
