import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/codestorm_logo.png";
import "../styles/dashboard.css";
import { useEffect, useState, useRef } from "react";

const Navbar = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const adminMenuRef = useRef(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setRole(localStorage.getItem("role"));
    setShowMobileMenu(false); // Close mobile menu on route change
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
        <Link to="/" style={{ color: "#22c55e", textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={logo} alt="CodeStorm Logo" style={{ height: "40px", width: "40px", borderRadius: "50%" }} />
          CodeStorm
        </Link>
      </h2>

      {/* MOBILE MENU TOGGLE */}
      <div className="menu-icon" onClick={() => setShowMobileMenu(!showMobileMenu)}>
        {showMobileMenu ? <span style={{ fontSize: "1.5rem", cursor: "pointer" }}>✕</span> : <span style={{ fontSize: "1.5rem", cursor: "pointer" }}>☰</span>}
      </div>

      {/* LINKS */}
      <div className={`nav-links ${showMobileMenu ? "active" : ""}`}>
        <Link to="/#events" onClick={() => setShowMobileMenu(false)}>Events</Link>
        <Link to="/#contact" onClick={() => setShowMobileMenu(false)}>Contact</Link>
        <Link to="/#about" onClick={() => setShowMobileMenu(false)}>About</Link>
        <Link to="/contests" onClick={() => setShowMobileMenu(false)}>Contests</Link>
        {role !== "admin" && <Link to="/discussion" onClick={() => setShowMobileMenu(false)}>Discussion</Link>}

        {token && role === "admin" && (
          <div ref={adminMenuRef} className="admin-dropdown-container">
            {/* ADMIN BUTTON */}
            <button
              type="button"
              className="admin-btn"
              onClick={() => setShowAdminMenu((prev) => !prev)}
            >
              Admin <span>▾</span>
            </button>

            {/* DROPDOWN */}
            {showAdminMenu && (
              <div className="admin-dropdown-menu">
                <Link className="dropdown-link" to="/dashboard" onClick={() => { setShowAdminMenu(false); setShowMobileMenu(false); }}>Dashboard</Link>
                <Link className="dropdown-link" to="/admin/events" onClick={() => { setShowAdminMenu(false); setShowMobileMenu(false); }}>Events</Link>
                <Link className="dropdown-link" to="/admin/connect" onClick={() => { setShowAdminMenu(false); setShowMobileMenu(false); }}>Contact</Link>
                <Link className="dropdown-link" to="/admin/about" onClick={() => { setShowAdminMenu(false); setShowMobileMenu(false); }}>About</Link>
                <Link className="dropdown-link" to="/admin/contests" onClick={() => { setShowAdminMenu(false); setShowMobileMenu(false); }}>Contests</Link>
                <Link className="dropdown-link" to="/admin/discussion" onClick={() => { setShowAdminMenu(false); setShowMobileMenu(false); }}>Discussion</Link>
              </div>
            )}
          </div>
        )}

        {/* LOGIN / LOGOUT */}
        {token ? (
          <button className="logout-btn" onClick={() => { logout(); setShowMobileMenu(false); }}>
            Logout
          </button>
        ) : (
          <Link to="/login" onClick={() => setShowMobileMenu(false)}>Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
