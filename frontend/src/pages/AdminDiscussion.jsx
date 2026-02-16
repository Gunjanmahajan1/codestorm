import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { FaPaperPlane, FaCheck, FaTrash, FaLock, FaUnlock, FaPlus, FaCamera, FaImage, FaTimes } from "react-icons/fa";
import { API_BASE_URL } from "../services/api";
import "../styles/dashboard.css";

const AdminDiscussion = () => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [enabled, setEnabled] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));


  /* ---------------- FETCH DATA ---------------- */
  const fetchMessages = async () => {
    try {
      const res = await api.get("/api/discussion");
      setMessages(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch discussion");
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await api.get("/api/discussion/settings");
      setEnabled(res.data.data.isEnabled);
    } catch (err) {
      console.error("Failed to fetch discussion settings");
    }
  };

  /* ---------------- SEND / EDIT MESSAGE ---------------- */
  const sendMessage = async () => {
    if (!content.trim() && !selectedFile) return;

    try {
      if (editingId) {
        await api.put(`/api/discussion/${editingId}`, { content });
        setEditingId(null);
      } else {
        const formData = new FormData();
        if (content.trim()) formData.append("content", content);
        if (selectedFile) formData.append("image", selectedFile);

        await api.post("/api/discussion", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setContent("");
      setSelectedFile(null);
      setShowOptions(false);
      fetchMessages();
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error("Message send/edit failed");
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setShowOptions(false);
    }
  };

  /* ---------------- DELETE MESSAGE ---------------- */
  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      await api.delete(`/api/discussion/${id}`);
      fetchMessages();
    } catch (err) {
      console.error("Delete failed");
    }
  };

  /* ---------------- TOGGLE DISCUSSION ---------------- */
  const toggleDiscussion = async () => {
    try {
      const res = await api.put("/api/discussion/toggle", {});
      setEnabled(res.data.data.isEnabled);
    } catch {
      alert("Toggle failed");
    }
  };


  /* ---------------- TIME FORMAT ---------------- */
  const formatTime = (date) => {
    const msgTime = new Date(date);
    const diffMin = Math.floor((Date.now() - msgTime.getTime()) / 60000);

    if (diffMin < 10) {
      return `${diffMin <= 0 ? 1 : diffMin} min ago`;
    }

    return msgTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDay = (date) => {
    const msgDate = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (msgDate.toDateString() === today.toDateString()) return "Today";
    if (msgDate.toDateString() === yesterday.toDateString()) return "Yesterday";

    return msgDate.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* ---------------- GROUP MESSAGES ---------------- */
  const groupedMessages =
    Array.isArray(messages) && messages.length > 0
      ? messages.reduce((acc, msg) => {
        const day = formatDay(msg.createdAt);
        if (!acc[day]) acc[day] = [];
        acc[day].push(msg);
        return acc;
      }, {})
      : {};

  /* ---------------- EFFECTS ---------------- */
  useEffect(() => {
    fetchMessages();
    fetchSettings();

    const interval = setInterval(() => {
      fetchMessages();
      fetchSettings();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = () => {
      setOpenMenuId(null);
      setShowOptions(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  /* ---------------- NOTIFICATIONS ---------------- */
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const lastMessageId = useRef(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (messages.length > 0) {
      const latestMsg = messages[messages.length - 1];
      const currentUserId = user?.id || user?._id;

      if (!isFirstLoad.current && lastMessageId.current && latestMsg._id !== lastMessageId.current) {
        // New message arrived
        if (latestMsg.author?._id !== currentUserId && document.visibilityState !== "visible") {
          if (Notification.permission === "granted") {
            new Notification(`New message from ${latestMsg.author?.name || "User"}`, {
              body: latestMsg.content || "Sent an image",
              icon: "/favicon.ico",
            });
          }
        }
      }

      lastMessageId.current = latestMsg._id;
      localStorage.setItem("lastMsgId", latestMsg._id);
      isFirstLoad.current = false;
    }
  }, [messages, user]);

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
      {/* ADMIN CONTROL HEADER */}
      <div className="chat-header-admin">
        <div className="header-info">
          <h2>Admin Discussion Room</h2>
          <span className={`status-badge ${enabled ? "enabled" : "disabled"}`}>
            {enabled ? "Room Open" : "Room Closed"}
          </span>
        </div>
        <button
          onClick={toggleDiscussion}
          className={`toggle-btn ${enabled ? "off" : "on"}`}
          title={enabled ? "Disable Discussion" : "Enable Discussion"}
        >
          {enabled ? <><FaLock /> Disable</> : <><FaUnlock /> Enable</>}
        </button>
      </div>

      <div className="chat-body" onClick={() => setOpenMenuId(null)}>
        {!user && (
          <p style={{ color: "white", padding: "1rem" }}>
            Loading discussion...
          </p>
        )}

        {user &&
          Object.keys(groupedMessages).length > 0 &&
          Object.keys(groupedMessages).map((day) => (
            <div key={day} style={{ display: "flex", flexDirection: "column" }}>
              <div className="chat-day">{day}</div>

              {groupedMessages[day].map((msg) => {
                const isOwn =
                  msg.author && user && (msg.author._id === user.id || msg.author._id === user._id);
                // In Admin room, admin can delete anyone.
                const canModify = true;

                return (
                  <div
                    key={msg._id}
                    className={`chat-row ${isOwn ? "own" : "other"}`}
                  >
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
                            src={`${API_BASE_URL}${msg.image}`}
                            alt="uploaded"
                            className="chat-msg-image"
                            onClick={() => window.open(`${API_BASE_URL}${msg.image}`, '_blank')}
                          />
                        )}
                      </div>

                      <div className="chat-footer">
                        <span className="chat-time">{formatTime(msg.createdAt)}</span>
                      </div>

                      {canModify && (
                        <div className="chat-actions" onClick={(e) => e.stopPropagation()}>
                          <div
                            className="dots"
                            onClick={() => setOpenMenuId(openMenuId === msg._id ? null : msg._id)}
                          >
                            ⋮
                          </div>
                          {openMenuId === msg._id && (
                            <div className="dropdown active">
                              {isOwn && (
                                <button
                                  onClick={() => {
                                    setEditingId(msg._id);
                                    setContent(msg.content);
                                    setOpenMenuId(null);
                                  }}
                                >
                                  Edit
                                </button>
                              )}
                              <button onClick={() => {
                                deleteMessage(msg._id);
                                setOpenMenuId(null);
                              }}>
                                Delete
                              </button>
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

      {/* INPUT BAR */}
      {token && (
        <div className="chat-input-bar">
          <div className="chat-input-options" onClick={(e) => e.stopPropagation()} style={{ flexShrink: 0 }}>
            <button className="add-btn" onClick={() => setShowOptions(!showOptions)} style={{ color: "#22c55e" }}>
              <FaPlus size={20} />
            </button>

            {showOptions && (
              <div className="upload-options">
                <div className="upload-option" onClick={() => cameraInputRef.current.click()}>
                  <FaCamera /> <span>Camera</span>
                </div>
                <div className="upload-option" onClick={() => fileInputRef.current.click()}>
                  <FaImage /> <span>Gallery</span>
                </div>
              </div>
            )}

            <input
              type="file"
              ref={cameraInputRef}
              style={{ display: "none" }}
              accept="image/*"
              capture="camera"
              onChange={handleFileChange}
            />
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleFileChange}
            />
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
              placeholder={enabled ? "Type a message" : "Room is disabled (Admin can still post)"}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
          </div>

          <button onClick={sendMessage} title={editingId ? "Update" : "Send"}>
            {editingId ? <FaCheck /> : <FaPaperPlane />}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDiscussion;
