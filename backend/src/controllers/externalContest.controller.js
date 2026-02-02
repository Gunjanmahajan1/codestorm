const axios = require("axios");

exports.getExternalContests = async (req, res) => {
  try {
    const response = await axios.get(
      "https://kontests.net/api/v1/all",
      { timeout: 10000 }
    );

    const contests = response.data.map((c) => ({
      name: c.name,
      platform: c.site,
      startTime: c.start_time,
      endTime: c.end_time,
      duration: c.duration,
      url: c.url,
      status: c.status, // BEFORE / CODING / FINISHED
    }));

    res.status(200).json({
      success: true,
      count: contests.length,
      data: contests,
    });
  } catch (error) {
    console.error("External contest fetch failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch external contests",
    });
  }
};
