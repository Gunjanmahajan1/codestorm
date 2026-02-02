const Contest = require("../models/Contest.model");

/* ---------------- CREATE CONTEST (ADMIN) ---------------- */
exports.createContest = async (req, res) => {
  try {
    const contest = await Contest.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Contest created",
      data: contest,
    });
  } catch (error) {
    res.status(500).json({ message: "Create contest failed" });
  }
};

/* ---------------- GET ALL CONTESTS (PUBLIC) ---------------- */
exports.getAllContests = async (req, res) => {
  try {
    const contests = await Contest.find().sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      data: contests,
    });
  } catch (error) {
    res.status(500).json({ message: "Fetch contests failed" });
  }
};

/* ---------------- UPDATE CONTEST (ADMIN) ---------------- */
exports.updateContest = async (req, res) => {
  try {
    const contest = await Contest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Contest updated",
      data: contest,
    });
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
};

/* ---------------- DELETE CONTEST (ADMIN) ---------------- */
exports.deleteContest = async (req, res) => {
  try {
    await Contest.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Contest deleted",
    });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
};
