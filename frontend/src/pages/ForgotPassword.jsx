import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/login.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );

      setMessage(
        `Reset token generated. Use it on Reset Password page.\nToken: ${res.data.resetToken}`
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to generate reset token"
      );
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>

        {error && <p className="error">{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Generate Reset Token</button>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          <Link to="/reset-password">Go to Reset Password</Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
