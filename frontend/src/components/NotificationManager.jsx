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
        if (!('Notification' in window)) return;
        
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            await subscribeToPush();
            setShowBanner(false);
        }
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
                    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
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
        // Only show banner if permission not set/denied and user is logged in
        const token = localStorage.getItem("token");
        if (token && 'Notification' in window && Notification.permission === 'default') {
            // Delay banner slightly for better UX
            setTimeout(() => setShowBanner(true), 2000);
        }
        
        if (token && Notification.permission === 'granted') {
            subscribeToPush();
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

