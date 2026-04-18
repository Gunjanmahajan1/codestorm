const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

// Connect to Database
connectDB();

const app = express();


/* -------------------- GLOBAL MIDDLEWARES -------------------- */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl)
      if (!origin) return callback(null, true);

      // Allow exact matches
      if (allowedOrigins.includes(origin)) return callback(null, true);

      // Allow any Vercel preview deployment for this project
      if (/^https:\/\/codestorm(-git-[a-z0-9-]+-gunjanmahajan1s-projects|(-[a-z0-9]+)*(-gunjanmahajan1s-projects)?)\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }

      callback(new Error(`CORS blocked: ${origin}`));
    },
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
const notificationRoutes = require("./routes/notification.routes");

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/discussion", discussionRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/external-contests", externalContestRoutes);
app.use("/api/core-team", require("./routes/coreTeam.routes"));
app.use("/api/about-slider", require("./routes/aboutSlider.routes"));
app.use("/api/about-content", require("./routes/aboutContent.routes"));
app.use("/api/events-slider", require("./routes/eventSlider.routes"));
app.use("/api/notifications", notificationRoutes);
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
