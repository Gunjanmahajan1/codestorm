import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/dashboard.css";

const AdminDiscussion = () => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [enabled, setEnabled] = useState(true);
  const token = localStorage.getItem("token");


  /* -------------------- FETCH DATA -------------------- */
  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/discussion",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load discussion");
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/discussion/settings"
      );
      setEnabled(res.data.data.isEnabled);
    } catch (err) {
      console.error("Failed to fetch discussion settings");
    }
  };

  const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};


  /* -------------------- POST MESSAGE -------------------- */
  const sendMessage = async () => {
    if (!content.trim()) return;

    try {
      await axios.post(
        "http://localhost:5000/api/discussion",
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setContent("");
      fetchMessages();
    } catch (err) {
      alert(err.response?.data?.message || "Message failed");
    }
  };

  /* -------------------- DELETE MESSAGE (ADMIN) -------------------- */
  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/discussion/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchMessages();
    } catch {
      alert("Delete failed");
    }
  };

  /* -------------------- TOGGLE DISCUSSION -------------------- */
  const toggleDiscussion = async () => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/discussion/toggle",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEnabled(res.data.data.isEnabled);
    } catch {
      alert("Toggle failed");
    }
  };

  /* -------------------- EFFECT -------------------- */
  useEffect(() => {
    fetchMessages();
    fetchSettings();
  }, []);

  /* -------------------- UI -------------------- */
  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <h1>Admin Discussion Room</h1>

        <button
          onClick={toggleDiscussion}
          className="logout-btn"
          style={{
            background: enabled ? "#DC2626" : "#16A34A",
            marginBottom: "1rem",
          }}
        >
          {enabled ? "Disable Discussion" : "Enable Discussion"}
        </button>

        {/* MESSAGE INPUT */}
        {enabled && (
          <div className="card" style={{ marginBottom: "1rem" }}>
            <textarea
              placeholder="Type a message..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ width: "100%", padding: "10px" }}
            />
            <button
              onClick={sendMessage}
              className="logout-btn"
              style={{ marginTop: "0.5rem" }}
            >
              Send
            </button>
          </div>
        )}

        {/* MESSAGE LIST */}
        <div className="card-grid">
          {messages.map((msg) => (
            <div key={msg._id} className="card">
              <p>{msg.content}</p>
<small>
  — {msg.author?.name} • {formatTimeAgo(msg.createdAt)}
</small>

              <button
                onClick={() => deleteMessage(msg._id)}
                style={{
                  marginTop: "0.5rem",
                  background: "#DC2626",
                  color: "#fff",
                  border: "none",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDiscussion;
