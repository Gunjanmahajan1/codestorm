import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/codestorm_logo.png";
import "../styles/dashboard.css";
import { useEffect, useState, useRef } from "react";
import api from "../services/api";
const Navbar = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const adminMenuRef = useRef(null);

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken !== token) setToken(storedToken);
    const storedRole = localStorage.getItem("role");
    if (storedRole !== role) setRole(storedRole);
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    if (JSON.stringify(parsedUser) !== JSON.stringify(user)) setUser(parsedUser);
    setShowMobileMenu(false);
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

  const logout = async () => {
    // Unsubscribe from push notifications before clearing state/token
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          // Tell backend to remove this subscription
          await api.post("/api/notifications/unsubscribe", { endpoint: subscription.endpoint });
          // Unsubscribe on browser side
          await subscription.unsubscribe();
          console.log("✅ Unsubscribed from push notifications on logout");
        }
      } catch (err) {
        console.error("❌ Failed to unsubscribe during logout:", err);
      }
    }

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setToken(null);
    setRole(null);
    setUser(null);
    navigate("/");
  };

  const homeLink = token
    ? (role === "admin" ? "/dashboard" : "/discussion")
    : "/";

  const scrollToSection = (hash) => {
    setShowMobileMenu(false);
    if (location.pathname !== "/") {
      navigate("/" + hash);
    } else {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="navbar">
      {/* LOGO */}
      <h2>
        <Link to={homeLink} style={{ color: "#22c55e", textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
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
        {/* Public Links */}
        <span className="nav-link" onClick={() => scrollToSection("#events")}>Events</span>
        <span className="nav-link" onClick={() => scrollToSection("#about")}>About</span>
        <span className="nav-link" onClick={() => scrollToSection("#core-committee")}>Core Committee</span>
        <span className="nav-link" onClick={() => scrollToSection("#contact")}>Contact Us</span>
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

            {/* DROPDOWN - Sequence updated */}
            {showAdminMenu && (
              <div className="admin-dropdown-menu">
                <Link className="dropdown-link" to="/admin/events" onClick={() => { setShowAdminMenu(false); setShowMobileMenu(false); }}>Events</Link>
                <Link className="dropdown-link" to="/admin/about" onClick={() => { setShowAdminMenu(false); setShowMobileMenu(false); }}>About</Link>
                <Link className="dropdown-link" to="/admin/connect" onClick={() => { setShowAdminMenu(false); setShowMobileMenu(false); }}>Contact Us</Link>
                <Link className="dropdown-link" to="/admin/contests" onClick={() => { setShowAdminMenu(false); setShowMobileMenu(false); }}>Contests</Link>
                <Link className="dropdown-link" to="/admin/discussion" onClick={() => { setShowAdminMenu(false); setShowMobileMenu(false); }}>Discussion</Link>
                <Link className="dropdown-link" to="/dashboard" onClick={() => { setShowAdminMenu(false); setShowMobileMenu(false); }}>Dashboard</Link>
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
