import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaCommentAlt, FaRocket } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NotificationToast = ({ toast, onClose }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (toast.link) {
      navigate(toast.link);
    }
    onClose(toast.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      className="notif-toast"
      onClick={handleClick}
      style={{
        background: "rgba(15, 23, 42, 0.95)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(34, 197, 94, 0.3)",
        borderRadius: "16px",
        padding: "16px",
        marginBottom: "12px",
        width: "320px",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)",
        cursor: "pointer",
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        position: "relative",
        zIndex: 9999,
        color: "white"
      }}
    >
      <div className="toast-icon" style={{
        background: "rgba(34, 197, 94, 0.15)",
        padding: "10px",
        borderRadius: "12px",
        color: "#22c55e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        {toast.type === "message" ? <FaCommentAlt size={18} /> : <FaRocket size={18} />}
      </div>

      <div style={{ flex: 1 }}>
        <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: "600", color: "#22c55e" }}>
          {toast.title}
        </h4>
        <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "#94a3b8", lineHeight: "1.4" }}>
          {toast.message}
        </p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose(toast.id);
        }}
        style={{
          background: "transparent",
          border: "none",
          color: "#475569",
          cursor: "pointer",
          padding: "4px",
          marginTop: "-4px",
          marginRight: "-4px",
          transition: "0.2s"
        }}
      >
        <FaTimes size={14} />
      </button>

      {/* Progress Bar */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 5, ease: "linear" }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "3px",
          background: "linear-gradient(to right, #22c55e, #16a34a)",
          borderRadius: "0 0 16px 16px"
        }}
      />
    </motion.div>
  );
};

export default NotificationToast;
