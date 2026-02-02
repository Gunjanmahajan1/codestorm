import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      { email, password }
    );

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
        <h2>CodeStrom </h2>

        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Admin"
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
          />

          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button type="submit">Login</button>
        <p style={{ marginTop: "1rem", textAlign: "center" }}>
  <Link to="/forgot-password">Forgot Password?</Link>
</p>

      </form>
    </div>
  );
};

export default Login;
