import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <h3 style={styles.logo}>CodeStrom</h3>
      <button onClick={logout} style={styles.btn}>
        Logout
      </button>
    </nav>
  );
};

const styles = {
  nav: {
    background: "#020617",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #22C55E",
  },
  logo: {
    color: "#22C55E",
  },
  btn: {
    background: "#22C55E",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Navbar;
