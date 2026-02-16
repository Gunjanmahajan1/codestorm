const Discussion = require("../models/Discussion.model");
const DiscussionSetting = require("../models/DiscussionSetting.model");

/* -------------------- GET MESSAGES -------------------- */
exports.getMessages = async (req, res, next) => {
  try {
    const settings =
      (await DiscussionSetting.findOne()) ||
      (await DiscussionSetting.create({ isEnabled: true }));

    if (!settings.isEnabled && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Discussion room is disabled",
      });
    }

    const messages = await Discussion.find()
      .populate("author", "name role")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

/* -------------------- POST MESSAGE -------------------- */
exports.postMessage = async (req, res, next) => {
  try {
    const settings =
      (await DiscussionSetting.findOne()) ||
      (await DiscussionSetting.create({ isEnabled: true }));

    if (!settings.isEnabled) {
      return res.status(403).json({
        success: false,
        message: "Discussion room is disabled",
      });
    }

    const { content } = req.body;
    let image = "";

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    if ((!content || !content.trim()) && !image) {
      return res.status(400).json({
        success: false,
        message: "Message content or image is required",
      });
    }

    const message = await Discussion.create({
      content,
      image,
      author: req.user._id,
      role: req.user.role,
    });

    res.status(201).json({
      success: true,
      message: "Message posted",
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

/* -------------------- GET SETTINGS -------------------- */
exports.getDiscussionSettings = async (req, res, next) => {
  try {
    const settings =
      (await DiscussionSetting.findOne()) ||
      (await DiscussionSetting.create({ isEnabled: true }));

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

/* -------------------- TOGGLE DISCUSSION (ADMIN) -------------------- */
exports.toggleDiscussionStatus = async (req, res, next) => {
  try {
    let settings = await DiscussionSetting.findOne();

    if (!settings) {
      settings = await DiscussionSetting.create({ isEnabled: true });
    }

    settings.isEnabled = !settings.isEnabled;
    await settings.save();

    res.status(200).json({
      success: true,
      message: "Discussion status updated",
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

/* -------------------- UPDATE MESSAGE -------------------- */
exports.updateMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    const message = await Discussion.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    // Only author or admin can update
    if (message.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    message.content = content;
    await message.save();

    res.status(200).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

/* -------------------- DELETE MESSAGE -------------------- */
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Discussion.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    // Only author or admin can delete
    if (message.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await message.deleteOne();

    res.status(200).json({ success: true, message: "Message deleted" });
  } catch (error) {
    next(error);
  }
};
