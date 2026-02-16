const express = require("express");
const router = express.Router();
const {
    getSliderImages,
    addSliderImage,
    deleteSliderImage,
} = require("../controllers/eventSlider.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.get("/", getSliderImages);
router.post("/", protect, adminOnly, upload.single("image"), addSliderImage);
router.delete("/:id", protect, adminOnly, deleteSliderImage);

module.exports = router;
