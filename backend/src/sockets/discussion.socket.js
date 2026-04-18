const Discussion = require("../models/Discussion.model");
const notificationService = require("../services/notification.service");

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
          content: message, // Assuming frontend sends 'message' but model uses 'content'
          author: userId,
          role,
        });

        const populatedMessage = await Discussion.findById(newMessage._id).populate("author", "name role");

        io.to("discussion-room").emit("newMessage", populatedMessage);

        // Send push notifications to everyone subscribed
        notificationService.broadcastPushNotification({
          title: `💬 ${populatedMessage.author?.name || "User"}`,
          body: populatedMessage.content || "Shared a message",
          data: { 
            link: "/discussion",
            type: "message"
          }
        });

      } catch (error) {
        console.error("Failed to send message:", error);
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
