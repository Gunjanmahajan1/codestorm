import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/api/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("user", JSON.stringify(res.data.user));



      const role = res.data.user.role;

      if (role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/discussion");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "Login failed (check console)"
      );
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>CodeStorm </h2>

        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Email Id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
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

        <button type="submit">Login</button>
        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          <Link to="/forgot-password">Forgot Password?</Link>
          <br />
          <span style={{ fontSize: "0.9rem", color: "#ccc" }}>
            Don't have an account? <Link to="/signup" style={{ color: "#22c55e" }}>Sign Up</Link>
          </span>
        </p>

      </form>
    </div>
  );
};

export default Login;
