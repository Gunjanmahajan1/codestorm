import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../styles/dashboard.css";

const Discussion = () => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const chatEndRef = useRef(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  /* ---------------- FETCH MESSAGES ---------------- */
  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/discussion",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch discussion");
    }
  };

  /* ---------------- SEND / EDIT MESSAGE ---------------- */
  const sendMessage = async () => {
    if (!content.trim()) return;

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/discussion/${editingId}`,
          { content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEditingId(null);
      } else {
        await axios.post(
          "http://localhost:5000/api/discussion",
          { content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setContent("");
      fetchMessages();
    } catch (err) {
      console.error("Message send/edit failed");
    }
  };

  /* ---------------- DELETE MESSAGE ---------------- */
  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/discussion/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
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

  /* ---------------- EFFECTS ---------------- */
  useEffect(() => {
    fetchMessages();

    const interval = setInterval(() => {
      fetchMessages();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------------- UI ---------------- */
  return (
    <div className="chat-page">
      <div className="chat-body">
        {!user && (
          <p style={{ color: "white", padding: "1rem" }}>
            Loading discussion...
          </p>
        )}

        {user &&
          Object.keys(groupedMessages).length > 0 &&
          Object.keys(groupedMessages).map((day) => (
            <div key={day}>
              <div className="chat-day">{day}</div>

              {groupedMessages[day].map((msg) => {
const isOwn =
  msg.author && user && msg.author._id === user._id;                
  const isAdmin = user && user.role === "admin";
                const canModify = isOwn || isAdmin;
console.log({
  isOwn,
  isAdmin,
  canModify,
  msg: msg.content,
});


                return (
                  <div
                    key={msg._id}
                    className={`chat-row ${isOwn ? "own" : "other"}`}
                  >
                    <div className="chat-bubble">
                      <p>{msg.content}</p>

                      <div className="chat-meta">
                        <span>{msg.author?.name}</span>
                        <span>{formatTime(msg.createdAt)}</span>
                      </div>

{canModify && (
  <div className="chat-actions">
    <details>
      <summary className="dots">⋮</summary>

      <div className="dropdown">
        {isOwn && (
          <button
            onClick={() => {
              setEditingId(msg._id);
              setContent(msg.content);
            }}
          >
            Edit
          </button>
        )}

        <button onClick={() => deleteMessage(msg._id)}>
          Delete
        </button>
      </div>
    </details>
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
          <button onClick={sendMessage}>
            {editingId ? "Update" : "Send"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Discussion;
