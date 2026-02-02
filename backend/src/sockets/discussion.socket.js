const Discussion = require("../models/Discussion.model");

let discussionEnabled = true;

const discussionSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    /* -------------------- JOIN ROOM -------------------- */
    socket.on("joinDiscussion", () => {
      socket.join("discussion-room");
      socket.emit("discussionStatus", discussionEnabled);
    });

    /* -------------------- SEND MESSAGE -------------------- */
    socket.on("sendMessage", async (data) => {
      try {
        if (!discussionEnabled) {
          socket.emit("errorMessage", {
            message: "Discussion room is disabled by admin.",
          });
          return;
        }

        const { message, userId, role } = data;

        if (!message || !userId) return;

        const newMessage = await Discussion.create({
          message,
          sentBy: userId,
          role,
        });

        io.to("discussion-room").emit("newMessage", newMessage);
      } catch (error) {
        socket.emit("errorMessage", {
          message: "Failed to send message",
        });
      }
    });

    /* -------------------- ADMIN TOGGLE -------------------- */
    socket.on("toggleDiscussion", () => {
      discussionEnabled = !discussionEnabled;
      io.to("discussion-room").emit(
        "discussionStatus",
        discussionEnabled
      );
    });

    /* -------------------- DISCONNECT -------------------- */
    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });
};

module.exports = discussionSocket;
