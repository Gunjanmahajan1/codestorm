import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import api, { API_BASE_URL } from "../services/api";
import { FaPaperPlane, FaCheck, FaPlus, FaCamera, FaImage, FaTimes } from "react-icons/fa";
import { getImageUrl } from "../utils/imageUrl";
import "../styles/dashboard.css";

const Discussion = () => {
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [showOptions, setShowOptions] = useState(false);
    const [discussionEnabled, setDiscussionEnabled] = useState(true);
    const [openMenuId, setOpenMenuId] = useState(null);

    const chatEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);
    const socketRef = useRef(null);

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    /* ---------------- FETCH MESSAGES ---------------- */
    const fetchMessages = async () => {
        try {
            const res = await api.get("/api/discussion");
            setMessages(res.data.data || []);
            setErrorMsg("");
        } catch (err) {
            console.error("Failed to fetch discussion");
            if (err.response?.status === 403) {
                setErrorMsg(err.response.data.message);
            }
        }
    };

    /* ---------------- SEND / EDIT MESSAGE ---------------- */
    const sendMessage = async () => {
        if (!content.trim() && !selectedFile) return;

        try {
            if (editingId) {
                await api.put(`/api/discussion/${editingId}`, { content });
                setEditingId(null);
                fetchMessages();
            } else if (selectedFile) {
                const formData = new FormData();
                if (content.trim()) formData.append("content", content);
                formData.append("image", selectedFile);
                await api.post("/api/discussion", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                fetchMessages();
            } else {
                if (socketRef.current) {
                    socketRef.current.emit("sendMessage", {
                        message: content,
                        userId: user?.id || user?._id,
                        role: user?.role
                    });
                }
            }

            setContent("");
            setSelectedFile(null);
            setShowOptions(false);

            setTimeout(() => {
                chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        } catch (err) {
            console.error("Message send failed");
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setShowOptions(false);
        }
    };

    const deleteMessage = async (id) => {
        if (!window.confirm("Delete this message?")) return;
        try {
            await api.delete(`/api/discussion/${id}`);
            fetchMessages();
        } catch (err) {
            console.error("Delete failed");
        }
    };

    /* ---------------- TIME / DATE FORMATTING ---------------- */
    const formatTime = (date) => {
        const msgTime = new Date(date);
        const diffMin = Math.floor((Date.now() - msgTime.getTime()) / 60000);
        if (diffMin < 10) return `${diffMin <= 0 ? 1 : diffMin} min ago`;
        return msgTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    };

    const formatDay = (date) => {
        const msgDate = new Date(date);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        if (msgDate.toDateString() === today.toDateString()) return "Today";
        if (msgDate.toDateString() === yesterday.toDateString()) return "Yesterday";
        return msgDate.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
    };

    const groupedMessages = Array.isArray(messages) ? messages.reduce((acc, msg) => {
        const day = formatDay(msg.createdAt);
        if (!acc[day]) acc[day] = [];
        acc[day].push(msg);
        return acc;
    }, {}) : {};

    /* ---------------- EFFECTS ---------------- */
    useEffect(() => {
        fetchMessages();

        socketRef.current = io(API_BASE_URL, { reconnection: true });
        socketRef.current.on("connect", () => socketRef.current.emit("joinDiscussion"));
        socketRef.current.on("newMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
            setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        });
        socketRef.current.on("discussionStatus", (status) => setDiscussionEnabled(status));

        const handleClick = () => {
            setOpenMenuId(null);
            setShowOptions(false);
        };
        document.addEventListener("click", handleClick);

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
            document.removeEventListener("click", handleClick);
        };
    }, []);

    const initialLoadDone = useRef(false);
    useEffect(() => {
        if (!initialLoadDone.current && messages.length > 0) {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
            initialLoadDone.current = true;
        }
    }, [messages]);

    /* ---------------- UI ---------------- */
    return (
        <div className="chat-page">
            <div className="chat-body" onClick={() => setOpenMenuId(null)}>
                {errorMsg && (
                    <div className="error-card">
                        <h3>{errorMsg}</h3>
                        <p>Discussion currently restricted.</p>
                    </div>
                )}

                {user && !errorMsg && Object.keys(groupedMessages).map((day) => (
                    <div key={day} style={{ display: "flex", flexDirection: "column" }}>
                        <div className="chat-day">{day}</div>
                        {groupedMessages[day].map((msg) => {
                            const isOwn = msg.author && user && (msg.author._id === user.id || msg.author._id === user._id);
                            const canModify = isOwn || user?.role === "admin";

                            return (
                                <div key={msg._id} className={`chat-row ${isOwn ? "own" : "other"}`}>
                                    {!isOwn && (
                                        <div className="chat-avatar">
                                            {msg.author?.name ? msg.author.name.charAt(0).toUpperCase() : "?"}
                                        </div>
                                    )}
                                    <div className={`chat-bubble ${msg.role === "admin" ? "admin" : ""}`}>
                                        {(!isOwn || msg.role === "admin") && (
                                            <div className="sender-name">
                                                {!isOwn && msg.author?.name}
                                                {msg.role === "admin" && <span className="admin-badge">Admin</span>}
                                            </div>
                                        )}
                                        <div className="chat-content">
                                            {msg.content}
                                            {msg.image && (
                                                <img
                                                    src={getImageUrl(msg.image)}
                                                    alt="upload"
                                                    className="chat-msg-image"
                                                    onClick={() => window.open(getImageUrl(msg.image), "_blank")}
                                                />
                                            )}
                                        </div>
                                        <div className="chat-footer">
                                            <span className="chat-time">{formatTime(msg.createdAt)}</span>
                                        </div>
                                        {canModify && (
                                            <div className="chat-actions" onClick={(e) => e.stopPropagation()}>
                                                <div className="dots" onClick={() => setOpenMenuId(openMenuId === msg._id ? null : msg._id)}>⋮</div>
                                                {openMenuId === msg._id && (
                                                    <div className="dropdown active">
                                                        {isOwn && (
                                                            <button onClick={() => { setEditingId(msg._id); setContent(msg.content); setOpenMenuId(null); }}>Edit</button>
                                                        )}
                                                        <button onClick={() => deleteMessage(msg._id)}>Delete</button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            {token && (
                <div className="chat-input-bar">
                    <div className="chat-input-options" onClick={(e) => e.stopPropagation()}>
                        <button className="add-btn" onClick={() => setShowOptions(!showOptions)}><FaPlus /></button>
                        {showOptions && (
                            <div className="upload-options">
                                <div className="upload-option" onClick={() => cameraInputRef.current.click()}><FaCamera /> <span>Camera</span></div>
                                <div className="upload-option" onClick={() => fileInputRef.current.click()}><FaImage /> <span>Gallery</span></div>
                            </div>
                        )}
                        <input type="file" ref={cameraInputRef} style={{ display: "none" }} accept="image/*" capture="camera" onChange={handleFileChange} />
                        <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*" onChange={handleFileChange} />
                    </div>

                    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                        {selectedFile && (
                            <div className="selected-file-preview">
                                <FaImage /> <span>{selectedFile.name}</span>
                                <FaTimes className="remove-file" onClick={() => setSelectedFile(null)} />
                            </div>
                        )}
                        <input
                            type="text"
                            placeholder={discussionEnabled ? "Type a message" : "Discussion is disabled"}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                            disabled={!discussionEnabled && user?.role !== "admin"}
                        />
                    </div>

                    <button onClick={sendMessage} disabled={(!content.trim() && !selectedFile) || (!discussionEnabled && user?.role !== "admin")}>
                        {editingId ? <FaCheck /> : <FaPaperPlane />}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Discussion;
