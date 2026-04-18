const webpush = require("web-push");
const PushSubscription = require("../models/PushSubscription.model");

// Configure web-push defensively to prevent startup crash
try {
    if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
        webpush.setVapidDetails(
            process.env.EMAIL_SUBJECT || "mailto:example@yourdomain.com",
            process.env.VAPID_PUBLIC_KEY,
            process.env.VAPID_PRIVATE_KEY
        );
        console.log("✅ Web-Push VAPID details configured.");
    } else {
        console.warn("⚠️ Web-Push VAPID keys missing. Push notifications will not work.");
    }
} catch (error) {
    console.error("❌ Failed to set VAPID details:", error.message);
}

/**
 * Send a push notification to a specific user
 * @param {string} userId - ID of the user to notify
 * @param {object} payload - Notification payload (title, body, data, etc.)
 */
exports.sendPushNotification = async (userId, payload) => {
    try {
        const subscriptions = await PushSubscription.find({ user: userId });
        
        const notifications = subscriptions.map(sub => {
            return webpush.sendNotification(
                sub.subscription,
                JSON.stringify(payload)
            ).catch(err => {
                console.error("Error sending push notification to endpoint:", sub.subscription.endpoint, err);
                if (err.statusCode === 410 || err.statusCode === 404) {
                    // Subscription has expired or is no longer valid
                    return PushSubscription.deleteOne({ _id: sub._id });
                }
            });
        });

        await Promise.all(notifications);
    } catch (error) {
        console.error("Error in sendPushNotification:", error);
    }
};

/**
 * Send a push notification to all subscribed users
 * @param {object} payload - Notification payload
 */
exports.broadcastPushNotification = async (payload) => {
    try {
        const subscriptions = await PushSubscription.find({});
        
        const notifications = subscriptions.map(sub => {
            return webpush.sendNotification(
                sub.subscription,
                JSON.stringify(payload)
            ).catch(err => {
                console.error("Error broadcasting push notification to endpoint:", sub.subscription.endpoint, err);
                if (err.statusCode === 410 || err.statusCode === 404) {
                    return PushSubscription.deleteOne({ _id: sub._id });
                }
            });
        });

        await Promise.all(notifications);
    } catch (error) {
        console.error("Error in broadcastPushNotification:", error);
    }
};
