const Discussion = require("../models/Discussion.model");
const DiscussionSetting = require("../models/DiscussionSetting.model");
const notificationService = require("../services/notification.service");

const discussionSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    /* -------------------- JOIN ROOM -------------------- */
    socket.on("joinDiscussion", async () => {
      socket.join("discussion-room");
      const settings = await DiscussionSetting.findOne() || await DiscussionSetting.create({ isEnabled: true });
      socket.emit("discussionStatus", settings.isEnabled);
    });

    /* -------------------- SEND MESSAGE -------------------- */
    socket.on("sendMessage", async (data) => {
      try {
        const settings = await DiscussionSetting.findOne() || { isEnabled: true };
        
        if (!settings.isEnabled && data.role !== "admin") {
          socket.emit("errorMessage", {
            message: "Discussion room is disabled by admin.",
          });
          return;
        }

        const { message, userId, role } = data;

        if (!message || !userId) return;

        const newMessage = await Discussion.create({
          content: message,
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
    socket.on("toggleDiscussion", async () => {
      let settings = await DiscussionSetting.findOne();
      if (!settings) settings = await DiscussionSetting.create({ isEnabled: true });
      
      settings.isEnabled = !settings.isEnabled;
      await settings.save();
      
      io.to("discussion-room").emit(
        "discussionStatus",
        settings.isEnabled
      );
    });

    /* -------------------- DISCONNECT -------------------- */
    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });
};

module.exports = discussionSocket;
