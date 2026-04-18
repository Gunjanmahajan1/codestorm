const webpush = require("web-push");
const PushSubscription = require("../models/PushSubscription.model");

// Configure web-push with VAPID keys
webpush.setVapidDetails(
    process.env.EMAIL_VAPID_SUBJECT || "mailto:example@yourdomain.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);


exports.getPublicKey = (req, res) => {
    try {
        const publicKey = process.env.VAPID_PUBLIC_KEY;
        if (!publicKey) {
            return res.status(500).json({ success: false, message: "VAPID Public Key not configured" });
        }
        res.status(200).json({ success: true, publicKey });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.subscribe = async (req, res) => {
    try {
        const { subscription } = req.body;
        const userId = req.user._id;

        if (!subscription || !subscription.endpoint) {
            return res.status(400).json({ success: false, message: "Invalid subscription object" });
        }

        // Upsert subscription
        await PushSubscription.findOneAndUpdate(
            { "subscription.endpoint": subscription.endpoint },
            { 
                user: userId,
                subscription: subscription
            },
            { upsert: true, new: true }
        );

        res.status(201).json({ success: true, message: "Successfully subscribed to push notifications" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.unsubscribe = async (req, res) => {
    try {
        const { endpoint } = req.body;
        if (!endpoint) {
            return res.status(400).json({ success: false, message: "Endpoint required to unsubscribe" });
        }

        await PushSubscription.findOneAndDelete({ "subscription.endpoint": endpoint });
        res.status(200).json({ success: true, message: "Unsubscribed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.sendToAll = async (req, res) => {
    try {
        const { title, body, icon, url } = req.body;

        if (!title || !body) {
            return res.status(400).json({ success: false, message: "Title and Body are required" });
        }

        const subscriptions = await PushSubscription.find({});
        console.log(`📣 Sending notification to ${subscriptions.length} subscribers`);

        const notificationPayload = JSON.stringify({
            title,
            body,
            icon: icon || "/codestorm_logo.png",
            data: {
                link: url || "/discussion"
            }
        });

        const sendPromises = subscriptions.map(async (subDoc) => {
            try {
                await webpush.sendNotification(subDoc.subscription, notificationPayload);
            } catch (error) {
                console.error(`❌ Push failed for endpoint: ${subDoc.subscription.endpoint}`, error.statusCode);
                // If subscription has expired or is no longer valid, remove it
                if (error.statusCode === 404 || error.statusCode === 410) {
                    await PushSubscription.findByIdAndDelete(subDoc._id);
                    console.log(`🗑️ Removed expired subscription: ${subDoc._id}`);
                }
            }
        });

        await Promise.all(sendPromises);

        res.status(200).json({
            success: true,
            message: `Notification sent to ${subscriptions.length} subscribers`
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

