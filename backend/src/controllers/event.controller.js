const Event = require("../models/Event.model");
const jwtService = require("../services/jwt.service");

/* -------------------- CREATE EVENT -------------------- */
exports.createEvent = async (req, res, next) => {
  try {
    const event = await Event.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

/* -------------------- GET ALL EVENTS -------------------- */
exports.getAllEvents = async (req, res, next) => {
  try {
    const { year, eventType } = req.query;

    // Default: only published events are returned (for students/public).
    // If request has a valid admin token, include drafts as well.
    const filter = {};

    let includeDrafts = false;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwtService.verifyToken(token);
        if (decoded && decoded.role === "admin") includeDrafts = true;
      } catch (err) {
        // invalid token -> treat as non-admin
      }
    }

    if (!includeDrafts) filter.isPublished = true;

    if (year) filter.year = year;
    if (eventType) filter.eventType = eventType;

    const events = await Event.find(filter)
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

/* -------------------- GET EVENT BY ID -------------------- */
exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // If event is not published, only allow admins to view it
    if (!event.isPublished) {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return res.status(404).json({
            success: false,
            message: "Event not found",
          });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwtService.verifyToken(token);
        if (!decoded || decoded.role !== "admin") {
          return res.status(404).json({
            success: false,
            message: "Event not found",
          });
        }
      } catch (err) {
        return res.status(404).json({
          success: false,
          message: "Event not found",
        });
      }
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

/* -------------------- UPDATE EVENT -------------------- */
exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

/* -------------------- DELETE EVENT -------------------- */
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.togglePublishEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.isPublished = !event.isPublished;
    await event.save();

    res.status(200).json({
      success: true,
      message: "Event publish status updated",
      data: event,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle publish status" });
  }
};


exports.uploadEventImage = async (req, res) => {
  try {
    const eventId = req.params.id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded",
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Append new images to existing ones
    const newImages = req.files.map((file) => `/uploads/${file.filename}`);
    event.images.push(...newImages);

    await event.save();

    res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      data: event,
    });
  } catch (error) {
    console.error("Upload image error:", error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};

/* -------------------- GET PUBLISHED EVENTS (STUDENT) -------------------- */
exports.getPublishedEvents = async (req, res) => {
  try {
    const { year, eventType } = req.query;

    const filter = { isPublished: true };
    if (year) filter.year = year;
    if (eventType) filter.eventType = eventType;

    const events = await Event.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error("getPublishedEvents error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch published events",
    });
  }
};
