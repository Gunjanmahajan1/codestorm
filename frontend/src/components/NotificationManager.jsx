import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { AnimatePresence } from "framer-motion";
import api, { API_BASE_URL } from "../services/api";
import logo from "../assets/codestorm_logo.png";
import NotificationToast from "./NotificationToast";

const NotificationManager = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [toasts, setToasts] = useState([]);
    const lastMsgId = useRef(localStorage.getItem("lastMsgId"));
    const lastEventId = useRef(localStorage.getItem("lastEventId"));
    const isFirstLoad = useRef(true);
    const socketRef = useRef(null);

    // Toast Management
    const addToast = (type, title, message, link) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, title, message, link }]);
        setTimeout(() => removeToast(id), 6000); 
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const subscribeToPush = async () => {
        try {
            if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
            if (Notification.permission !== "granted") return;
            
            const token = localStorage.getItem("token");
            if (!token) return;

            const registration = await navigator.serviceWorker.ready;
            let subscription = await registration.pushManager.getSubscription();
            
            if (!subscription) {
                const { data } = await api.get("/api/notifications/public-key");
                const publicKey = data.publicKey;

                const urlBase64ToUint8Array = (base64String) => {
                    const padding = '='.repeat((4 - base64String.length % 4) % 4);
                    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
                    const rawData = window.atob(base64);
                    const outputArray = new Uint8Array(rawData.length);
                    for (let i = 0; i < rawData.length; ++i) {
                        outputArray[i] = rawData.charCodeAt(i);
                    }
                    return outputArray;
                };

                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(publicKey)
                });
            }

            await api.post("/api/notifications/subscribe", { subscription });
            console.log("✅ Push subscription synced with backend");
        } catch (error) {
            console.error("❌ Failed to subscribe to push notifications", error);
        }
    };

    useEffect(() => {
        subscribeToPush();
        const handler = () => subscribeToPush();
        window.addEventListener('notification-permission-granted', handler);
        return () => window.removeEventListener('notification-permission-granted', handler);
    }, []);

    const checkNotifications = async () => {
        try {
            const res = await api.get("/api/events/public");
            const events = res.data.data || res.data || [];
            if (events.length > 0) {
                const latestEvent = events[0];
                
                if (!isFirstLoad.current && lastEventId.current && latestEvent._id !== lastEventId.current) {
                    if (Notification.permission === "granted") {
                        navigator.serviceWorker.ready.then(registration => {
                            registration.showNotification(`🚀 New Event: ${latestEvent.title}`, {
                                body: latestEvent.description ? latestEvent.description.substring(0, 100) : "Check out the newest event!",
                                icon: "/codestorm_logo.png",
                                tag: `event-${latestEvent._id}`,
                                data: { link: "/events" },
                            });
                        });
                    }
                    addToast("event", "New Event Update!", latestEvent.title, "/events");
                }
                lastEventId.current = latestEvent._id;
                localStorage.setItem("lastEventId", latestEvent._id);
            }
        } catch (err) {
            console.error("NotificationManager: Event fetch failed", err);
        }
        isFirstLoad.current = false;
    };

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;
        const token = localStorage.getItem("token");

        // CLEANUP PREVIOUS SOCKET
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }

        // SOCKET CONNECTION
        if (token) {
            socketRef.current = io(API_BASE_URL, {
                reconnection: true,
                reconnectionAttempts: 10,
            });

            socketRef.current.on("connect", () => {
                console.log("🟢 Notification Socket Connected:", socketRef.current.id);
                socketRef.current.emit("joinDiscussion");
            });

            socketRef.current.on("newMessage", (msg) => {
                console.log("📩 Notification Socket received message:", msg);
                const currentUserId = user?.id || user?._id;
                const isOnDiscussionPage = window.location.pathname === "/discussion" || window.location.pathname === "/admin/discussion";
                
                // ROBUST ID CHECK
                const msgAuthorId = msg.author?._id || msg.author;
                const isMsgFromSelf = msgAuthorId && currentUserId && msgAuthorId.toString() === currentUserId.toString();

                console.log("🔍 Notif Check - From Self:", isMsgFromSelf, "On Page:", isOnDiscussionPage);

                if (!isMsgFromSelf) {
                    // 1. SYSTEM NOTIFICATION (Using Service Worker for max reliability)
                    if (Notification.permission === "granted") {
                        navigator.serviceWorker.ready.then(registration => {
                            registration.showNotification(`💬 ${msg.author?.name || "User"}`, {
                                body: msg.content || "Sent an image",
                                icon: "/codestorm_logo.png", // Use root path for SW
                                tag: `msg-${msg._id}`,
                                data: { link: "/discussion" },
                                badge: "/codestorm_logo.png",
                                vibrate: [100, 50, 100],
                            });
                        });
                    }

                    // 2. IN-APP POP-UP (Only if not on discussion page)
                    if (!isOnDiscussionPage) {
                        console.log("✨ triggering toast...");
                        addToast("message", `Message from ${msg.author?.name || "User"}`, msg.content || "Shared an image", "/discussion");
                    }
                }
                
                lastMsgId.current = msg._id;
                localStorage.setItem("lastMsgId", msg._id);
            });
            
            socketRef.current.on("connect_error", (err) => {
                console.error("🔴 Notification Socket Connection Error:", err);
            });
        }

        checkNotifications();
    }, [location.pathname]); // Re-run on route changes to ensure socket state matches auth

    useEffect(() => {
        const interval = setInterval(checkNotifications, 30000); // Polling for events independently
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            position: "fixed",
            top: "80px", // Below navbar
            right: "20px",
            zIndex: 99999,
            pointerEvents: "none" // Allow clicks through container
        }}>
            <div style={{ pointerEvents: "auto" }}>
                <AnimatePresence>
                    {toasts.map(toast => (
                        <NotificationToast 
                            key={toast.id} 
                            toast={toast} 
                            onClose={removeToast} 
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default NotificationManager;
