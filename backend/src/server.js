const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const discussionSocket = require("./sockets/discussion.socket");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust origins in production
    methods: ["GET", "POST"]
  }
});

// Initialize Sockets
discussionSocket(io);

// Expose io for controllers
app.set("socketio", io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 CodeStrom Backend running on port ${PORT} with Sockets Enabled`);
});

