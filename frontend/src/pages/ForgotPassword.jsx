import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/login.css";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await api.post("/api/auth/forgot-password", { email });
      setMessage(res.data.message || "OTP sent to your email.");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await api.post("/api/auth/verify-otp", {
        email,
        otp,
      });
      setMessage("OTP verified! Set your new password.");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await api.post("/api/auth/reset-password", {
        email,
        otp,
        password,
      });


      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>
          {step === 1
            ? "Forgot Password"
            : step === 2
              ? "Verify OTP"
              : "New Password"}
        </h2>

        {error && <p className="error">{error}</p>}
        {message && (
          <p
            style={{
              color: "var(--green)",
              textAlign: "center",
              marginBottom: "1rem",
              fontSize: "0.9rem",
            }}
          >
            {message}
          </p>
        )}

        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Send OTP</button>
            <p
              style={{
                marginTop: "1.5rem",
                textAlign: "center",
                fontSize: "0.9rem",
              }}
            >
              Remembered your password?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                style={{
                  display: "inline",
                  width: "auto",
                  background: "none",
                  border: "none",
                  color: "var(--green)",
                  padding: 0,
                  margin: 0,
                  textDecoration: "underline",
                }}
              >
                Login
              </button>
            </p>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <p style={{ textAlign: "center", marginBottom: "1rem", fontSize: "0.85rem", opacity: 0.8 }}>
              Enter the 6-digit code sent to <b>{email}</b>
            </p>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
            />
            <button type="submit">Verify OTP</button>
            <button
              type="button"
              onClick={() => setStep(1)}
              style={{
                background: "transparent",
                border: "1px solid var(--green)",
                color: "var(--green)",
                marginTop: "10px",
              }}
            >
              Back
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="password-input"
              />
              <div
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="password-input"
              />
              <div
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            <button type="submit">Reset Password</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
