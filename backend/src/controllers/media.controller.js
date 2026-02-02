const Media = require("../models/Media.model");

/* -------------------- UPLOAD MEDIA -------------------- */
exports.uploadMedia = async (req, res, next) => {
  try {
    const { title, url, mediaType, event } = req.body;

    if (!url || !mediaType) {
      return res.status(400).json({
        success: false,
        message: "Media URL and type are required",
      });
    }

    const media = await Media.create({
      title,
      url,
      mediaType,
      event,
      uploadedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Media uploaded successfully",
      data: media,
    });
  } catch (error) {
    next(error);
  }
};

/* -------------------- GET ALL MEDIA -------------------- */
exports.getAllMedia = async (req, res, next) => {
  try {
    const media = await Media.find()
      .sort({ createdAt: -1 })
      .populate("uploadedBy", "name")
      .populate("event", "title");

    res.status(200).json({
      success: true,
      count: media.length,
      data: media,
    });
  } catch (error) {
    next(error);
  }
};

/* -------------------- DELETE MEDIA -------------------- */
exports.deleteMedia = async (req, res, next) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Media deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
