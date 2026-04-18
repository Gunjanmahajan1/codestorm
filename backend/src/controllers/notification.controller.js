const PushSubscription = require("../models/PushSubscription.model");

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
