import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/dashboard.css";
import { useEffect, useState, useRef } from "react";

const Navbar = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
const adminMenuRef = useRef(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setRole(localStorage.getItem("role"));
  }, [location]);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      adminMenuRef.current &&
      !adminMenuRef.current.contains(event.target)
    ) {
      setShowAdminMenu(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* LOGO */}
      <h2>
        <Link to="/" style={{ color: "#22c55e", textDecoration: "none" }}>
          CodeStrom
        </Link>
      </h2>

      {/* LINKS */}
      <div style={{ display: "flex", gap: "1.2rem", alignItems: "center" }}>
        <Link to="/events">Events</Link>
        <Link to="/contests">Contests</Link>
        <Link to="/connect">Contact</Link>
        <Link to="/discussion">Discussion</Link>
        <Link to="/about">About</Link>

{token && role === "admin" && (
<div ref={adminMenuRef} style={{ position: "relative" }}>
    {/* ADMIN BUTTON (TEXT + ARROW = ONE CLICK AREA) */}
    <button
      type="button"
      onClick={() => setShowAdminMenu((prev) => !prev)}
      style={{
        background: "transparent",
        border: "none",
        color: "white",
        fontWeight: "600",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "1rem",
      }}
    >
      Admin <span>▾</span>
    </button>

    {/* DROPDOWN */}
    {showAdminMenu && (
      <div
        style={{
          position: "absolute",
          top: "2rem",
          right: 0,
          background: "#020617",
          border: "1px solid #334155",
          borderRadius: "8px",
          minWidth: "160px",
          zIndex: 100,
        }}
      >
        <Link
          className="dropdown-link"
          to="/admin/events"
          onClick={() => setShowAdminMenu(false)}
        >
          Events
        </Link>
        <Link
          className="dropdown-link"
          to="/admin/contests"
          onClick={() => setShowAdminMenu(false)}
        >
          Contests
        </Link>
        <Link
          className="dropdown-link"
          to="/admin/connect"
          onClick={() => setShowAdminMenu(false)}
        >
          Contact
        </Link>
        <Link
          className="dropdown-link"
          to="/admin/discussion"
          onClick={() => setShowAdminMenu(false)}
        >
          Discussion
        </Link>
        <Link
          className="dropdown-link"
          to="/admin/about"
          onClick={() => setShowAdminMenu(false)}
        >
          About
        </Link>
      </div>
    )}
  </div>
)}

        {/* LOGIN / LOGOUT */}
{token ? (
  <button className="logout-btn" onClick={logout}>
    Logout
  </button>
) : (
  <>
    <Link to="/login">Login</Link>
    <Link to="/signup">Signup</Link>
  </>
)}
      </div>
    </nav>
  );
};

export default Navbar;
