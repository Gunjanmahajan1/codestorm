const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");


const app = express();

/* -------------------- GLOBAL MIDDLEWARES -------------------- */

// CORS (ONLY ONCE)
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

// JSON parser
app.use(express.json());

// Serve uploads (MUST BE BEFORE ROUTES)
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"))
);

// Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/* -------------------- ROUTES -------------------- */

const authRoutes = require("./routes/auth.routes");
const eventRoutes = require("./routes/event.routes");
const contestRoutes = require("./routes/contest.routes");
const mediaRoutes = require("./routes/media.routes");
const contactRoutes = require("./routes/contact.routes");
const discussionRoutes = require("./routes/discussion.routes");
const socialRoutes = require("./routes/social.routes");
const externalContestRoutes = require("./routes/externalContest.routes");

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/discussion", discussionRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/external-contests", externalContestRoutes);
/* -------------------- HEALTH CHECK -------------------- */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CodeStrom API is running 🚀",
  });
});


//const contestRoutes = require("./routes/contest.routes");
//app.use("/api/contests", contestRoutes);

/* -------------------- ERROR HANDLER -------------------- */

const errorHandler = require("./middleware/error.middleware");
app.use(errorHandler);

module.exports = app;
