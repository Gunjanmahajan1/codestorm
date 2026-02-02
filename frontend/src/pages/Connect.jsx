import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/dashboard.css";
import {
  FaEnvelope,
  FaLinkedin,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

const Connect = () => {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/contact")
      .then((res) => {
        setContact(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <p style={{ padding: "1rem" }}>Loading contact details...</p>;
  }

  if (!contact) {
    return <p style={{ padding: "1rem" }}>No contact details available.</p>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <h1>Connect With Us 🤝</h1>

        <div className="card-grid">
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="card"
              style={{ borderLeft: "6px solid #EF4444" }}
            >
              <FaEnvelope size={28} color="#EF4444" />
              <h3>Email</h3>
              <p>{contact.email}</p>
            </a>
          )}

          {contact.linkedin && (
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noreferrer"
              className="card"
              style={{ borderLeft: "6px solid #0A66C2" }}
            >
              <FaLinkedin size={28} color="#0A66C2" />
              <h3>LinkedIn</h3>
              <p>View Profile</p>
            </a>
          )}

          {contact.instagram && (
            <a
              href={contact.instagram}
              target="_blank"
              rel="noreferrer"
              className="card"
              style={{ borderLeft: "6px solid #E1306C" }}
            >
              <FaInstagram size={28} color="#E1306C" />
              <h3>Instagram</h3>
              <p>@codestrom</p>
            </a>
          )}

          {contact.whatsapp && (
            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="card"
              style={{ borderLeft: "6px solid #25D366" }}
            >
              <FaWhatsapp size={28} color="#25D366" />
              <h3>WhatsApp</h3>
              <p>Join Group</p>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Connect;
