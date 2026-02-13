import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/dashboard.css";

const AdminConnect = () => {
  const [form, setForm] = useState({
    email: "",
    linkedin: "",
    instagram: "",
    whatsapp: "",
  });

  useEffect(() => {
    api
      .get("/api/contact")
      .then((res) => {
        const data = res?.data?.data || {};

        setForm({
          email: data.email || "",
          linkedin: data.linkedin || "",
          instagram: data.instagram || "",
          whatsapp: data.whatsapp || "",
        });
      })
      .catch((err) => {
        console.error("Failed to load contact details", err);
      });
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const save = async () => {
    try {
      await api.put("/api/contact", form);

      alert("Contact details updated successfully");
    } catch (error) {
      console.error("Failed to update contact details", error);
      alert("Update failed");
    }
  };


  return (
    <div className="dashboard-content">
      <h1>Edit Contact Details</h1>

      <div className="card" style={{ maxWidth: "600px", marginTop: "2rem" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>Email</label>
          <input
            name="email"
            value={form.email ?? ""}
            placeholder="e.g. contact@codestorm.com"
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>LinkedIn URL</label>
          <input
            name="linkedin"
            value={form.linkedin ?? ""}
            placeholder="e.g. linkedin.com/company/codestorm"
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>Instagram URL</label>
          <input
            name="instagram"
            value={form.instagram ?? ""}
            placeholder="e.g. instagram.com/codestorm"
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>WhatsApp Group Link</label>
          <input
            name="whatsapp"
            value={form.whatsapp ?? ""}
            placeholder="e.g. chat.whatsapp.com/..."
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </div>

        <button className="logout-btn" type="button" onClick={save} style={{ width: "100%", marginTop: "1rem" }}>
          Save Contact Details
        </button>
      </div>
    </div>
  );
};

export default AdminConnect;
