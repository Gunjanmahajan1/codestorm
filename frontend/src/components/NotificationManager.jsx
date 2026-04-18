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

    const [showBanner, setShowBanner] = useState(false);

    // Toast Management
    const addToast = (type, title, message, link) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, title, message, link }]);
        setTimeout(() => removeToast(id), 6000); 
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const handleGrantPermission = async () => {
        console.log("🔔 [NotificationManager] Permission request triggered by user gesture");
        
        if (!('Notification' in window)) {
            console.error("❌ [NotificationManager] Browser does not support desktop notifications");
            return;
        }

        if (!window.isSecureContext) {
            console.error("❌ [NotificationManager] Notifications require a secure context (HTTPS or localhost)");
            addToast("error", "Security Error", "Notifications require HTTPS or localhost to work.");
            return;
        }

        try {
            const permission = await Notification.requestPermission();
            console.log("📊 [NotificationManager] Permission result:", permission);
            
            if (permission === 'granted') {
                console.log("✅ [NotificationManager] Permission granted, subscribing...");
                await subscribeToPush();
                setShowBanner(false);
            } else if (permission === 'denied') {
                console.warn("🚫 [NotificationManager] Permission denied by user");
                addToast("info", "Notifications Blocked", "Please enable notifications in your browser settings to receive updates.");
                setShowBanner(false);
            } else {
                console.log("❓ [NotificationManager] Permission dismissed (default)");
            }
        } catch (error) {
            console.error("❌ [NotificationManager] Error requesting permission:", error);
        }
    };

    const subscribeToPush = async () => {
        try {
            console.log("🔄 [NotificationManager] Starting push subscription process...");
            
            if (!('serviceWorker' in navigator)) {
                console.error("❌ [NotificationManager] Service Workers not supported");
                return;
            }
            
            if (!('PushManager' in window)) {
                console.error("❌ [NotificationManager] Push API not supported");
                return;
            }

            if (Notification.permission !== "granted") {
                console.warn("⚠️ [NotificationManager] Cannot subscribe: permission not granted");
                return;
            }
            
            const token = localStorage.getItem("token");
            if (!token) {
                console.warn("⚠️ [NotificationManager] Cannot subscribe: No auth token found");
                return;
            }

            console.log("⏳ [NotificationManager] Waiting for Service Worker to be ready...");
            const registration = await navigator.serviceWorker.ready;
            console.log("✅ [NotificationManager] Service Worker ready:", registration.scope);

            let subscription = await registration.pushManager.getSubscription();
            
            if (!subscription) {
                console.log("🛰️ [NotificationManager] No existing subscription found. Fetching public key...");
                const { data } = await api.get("/api/notifications/public-key");
                const publicKey = data.publicKey;
                console.log("🔑 [NotificationManager] Public key received");

                const urlBase64ToUint8Array = (base64String) => {
                    const padding = '='.repeat((4 - base64String.length % 4) % 4);
                    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
                    const rawData = window.atob(base64);
                    const outputArray = new Uint8Array(rawData.length);
                    for (let i = 0; i < rawData.length; ++i) {
                        outputArray[i] = rawData.charCodeAt(i);
                    }
                    return outputArray;
                };

                console.log("📡 [NotificationManager] Subscribing to push services...");
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(publicKey)
                });
                console.log("✅ [NotificationManager] Push subscription created");
            } else {
                console.log("✅ [NotificationManager] Existing push subscription found");
            }

            console.log("📤 [NotificationManager] Syncing subscription with backend...");
            await api.post("/api/notifications/subscribe", { subscription });
            console.log("🚀 [NotificationManager] Push subscription synced successfully");
        } catch (error) {
            console.error("❌ [NotificationManager] Failed to subscribe to push notifications", error);
            // Check if error is related to service worker path
            if (error.message && error.message.includes('ServiceWorker')) {
                console.error("💡 [NotificationManager] Tip: Ensure /sw.js is accessible in your public folder");
            }
        }
    };

    useEffect(() => {
        console.log("🔍 [NotificationManager] Initializing...");
        console.log("🔍 [NotificationManager] Current Permission Status:", Notification.permission);
        console.log("🔍 [NotificationManager] Is Secure Context:", window.isSecureContext);

        // Only show banner if permission not set/denied and user is logged in
        const token = localStorage.getItem("token");
        if (token && 'Notification' in window) {
            if (Notification.permission === 'default') {
                console.log("💡 [NotificationManager] Permission is default, showing banner in 2s...");
                // Delay banner slightly for better UX
                const timer = setTimeout(() => setShowBanner(true), 2000);
                return () => clearTimeout(timer);
            } else if (Notification.permission === 'denied') {
                console.warn("⚠️ [NotificationManager] Notifications are blocked. User needs to manually enable them.");
            } else if (Notification.permission === 'granted') {
                console.log("✅ [NotificationManager] Notifications already granted. Subscribing...");
                subscribeToPush();
            }
        }
    }, []);

    const checkNotifications = async () => {
        try {
            const res = await api.get("/api/events/public");
            const events = res.data.data || res.data || [];
            if (events.length > 0) {
                const latestEvent = events[0];
                
                if (!isFirstLoad.current && lastEventId.current && latestEvent._id !== lastEventId.current) {
                    addToast("event", "New Event Update!", latestEvent.title, "/events");
                    // System notification if granted
                    if (Notification.permission === "granted") {
                        navigator.serviceWorker.ready.then(reg => {
                            reg.showNotification(`🚀 New Event: ${latestEvent.title}`, {
                                body: latestEvent.description ? latestEvent.description.substring(0, 100) : "Check out the newest event!",
                                icon: "/codestorm_logo.png",
                                data: { link: "/events" },
                            });
                        });
                    }
                }
                lastEventId.current = latestEvent._id;
                localStorage.setItem("lastEventId", latestEvent._id);
            }
        } catch (err) {
            console.error("NotificationManager: Event fetch failed", err);
        }
        isFirstLoad.current = false;
    };

    // Socket Lifecycle
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;

        if (!token) {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            return;
        }

        if (!socketRef.current) {
            socketRef.current = io(API_BASE_URL, {
                reconnection: true,
                reconnectionAttempts: 10,
            });

            socketRef.current.on("connect", () => {
                console.log("🟢 Notification Socket Connected:", socketRef.current.id);
                socketRef.current.emit("joinDiscussion");
            });

            socketRef.current.on("newMessage", (msg) => {
                const currentUserId = user?.id || user?._id;
                const path = window.location.pathname;
                const isOnDiscussionPage = path === "/discussion" || path === "/admin/discussion" || path.includes("/discussion");
                
                const msgAuthorId = msg.author?._id || msg.author;
                const isMsgFromSelf = msgAuthorId && currentUserId && msgAuthorId.toString() === currentUserId.toString();

                if (!isMsgFromSelf) {
                    // 1. SYSTEM NOTIFICATION (Only if visible and on another page, or tab in background)
                    if (Notification.permission === "granted") {
                        navigator.serviceWorker.ready.then(registration => {
                            // Only show system notification if not looking at the discussion
                            if (!isOnDiscussionPage || document.visibilityState !== 'visible') {
                                registration.showNotification(`💬 ${msg.author?.name || "User"}`, {
                                    body: msg.content || "Sent an image",
                                    icon: "/codestorm_logo.png",
                                    tag: `msg-${msg._id}`,
                                    data: { link: "/discussion" },
                                    badge: "/codestorm_logo.png",
                                    vibrate: [100, 50, 100],
                                });
                            }
                        });
                    }

                    // 2. IN-APP POP-UP
                    if (!isOnDiscussionPage) {
                        addToast("message", `Message from ${msg.author?.name || "User"}`, msg.content || "Shared an image", "/discussion");
                    }
                }
            });
        }

        checkNotifications();
    }, [location.pathname]);

    useEffect(() => {
        const interval = setInterval(checkNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* Permission Banner */}
            <AnimatePresence>
                {showBanner && (
                    <div style={{
                        position: "fixed",
                        bottom: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 100000,
                        width: "90%",
                        maxWidth: "400px",
                        background: "rgba(15, 23, 42, 0.95)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(34, 197, 94, 0.3)",
                        padding: "16px",
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
                        color: "white",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <img src="/codestorm_logo.png" alt="logo" style={{ width: "32px", height: "32px" }} />
                            <div>
                                <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}>Enable Notifications?</h4>
                                <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>Get updates and new messages even when out.</p>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <button 
                                onClick={handleGrantPermission}
                                style={{
                                    flex: 1,
                                    background: "#22c55e",
                                    color: "black",
                                    border: "none",
                                    padding: "8px",
                                    borderRadius: "6px",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    cursor: "pointer"
                                }}
                            >
                                Enable
                            </button>
                            <button 
                                onClick={() => setShowBanner(false)}
                                style={{
                                    flex: 1,
                                    background: "rgba(255,255,255,0.1)",
                                    color: "white",
                                    border: "none",
                                    padding: "8px",
                                    borderRadius: "6px",
                                    fontSize: "12px",
                                    cursor: "pointer"
                                }}
                            >
                                Later
                            </button>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* Toast Container */}
            <div style={{
                position: "fixed",
                top: "80px",
                right: "20px",
                zIndex: 99999,
                pointerEvents: "none"
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
        </>
    );
};

export default NotificationManager;

