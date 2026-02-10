import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { FaPaperPlane, FaCheck } from "react-icons/fa";
import "../styles/dashboard.css";

const Discussion = () => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const chatEndRef = useRef(null);

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
    if (!content.trim()) return;

    try {
      if (editingId) {
        await api.put(`/api/discussion/${editingId}`, { content });
        setEditingId(null);
      } else {
        await api.post("/api/discussion", { content });
      }

      setContent("");
      fetchMessages();
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error("Message send/edit failed");
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

  const [openMenuId, setOpenMenuId] = useState(null);

  /* ... effect for outside click ... */
  useEffect(() => {
    const handleClick = () => setOpenMenuId(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  /* ---------------- EFFECTS ---------------- */
  useEffect(() => {
    fetchMessages();

    const interval = setInterval(() => {
      fetchMessages();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // REDUCED Auto-scroll: Only on first load or when sending
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
          <div style={{
            color: "#EF4444",
            padding: "2rem",
            textAlign: "center",
            background: "rgba(239, 68, 68, 0.1)",
            borderRadius: "12px",
            margin: "2rem"
          }}>
            <h3>{errorMsg}</h3>
            <p>Please check back later or contact an administrator.</p>
          </div>
        )}

        {user &&
          !errorMsg &&
          Object.keys(groupedMessages).length > 0 &&
          Object.keys(groupedMessages).map((day) => (
            <div key={day} style={{ display: "flex", flexDirection: "column" }}>
              <div className="chat-day">{day}</div>

              {groupedMessages[day].map((msg) => {
                const isOwn =
                  msg.author && user && (msg.author._id === user.id || msg.author._id === user._id);
                const isAdmin = user && user.role === "admin";
                const canModify = isOwn || isAdmin;


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
          <input
            type="text"
            placeholder="Type a message"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button onClick={sendMessage} title={editingId ? "Update" : "Send"}>
            {editingId ? <FaCheck /> : <FaPaperPlane />}
          </button>
        </div>
      )}
    </div>
  );
};

export default Discussion;
