const AboutSlider = require("../models/AboutSlider.model");
const fs = require("fs");
const path = require("path");

// GET all slider images
exports.getSliderImages = async (req, res, next) => {
    try {
        const images = await AboutSlider.find().sort({ order: 1, createdAt: -1 });
        res.status(200).json({ success: true, data: images });
    } catch (error) {
        next(error);
    }
};

// ADD slider image
exports.addSliderImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload an image" });
        }

        const { order } = req.body;
        const imageUrl = `/uploads/${req.file.filename}`;

        const newImage = await AboutSlider.create({
            imageUrl,
            order: order || 0,
        });

        res.status(201).json({
            success: true,
            data: newImage,
        });
    } catch (error) {
        next(error);
    }
};

// DELETE slider image
exports.deleteSliderImage = async (req, res, next) => {
    try {
        const image = await AboutSlider.findById(req.params.id);

        if (!image) {
            return res.status(404).json({ success: false, message: "Image not found" });
        }

        // Delete file from disk
        const filePath = path.join(__dirname, "../../", image.imageUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await image.deleteOne();

        res.status(200).json({
            success: true,
            message: "Image deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
