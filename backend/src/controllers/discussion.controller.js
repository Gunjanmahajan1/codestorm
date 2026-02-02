const Discussion = require("../models/Discussion.model");
const DiscussionSetting = require("../models/DiscussionSetting.model");

/* -------------------- GET MESSAGES -------------------- */
exports.getMessages = async (req, res, next) => {
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

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }

    const message = await Discussion.create({
      content,
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
