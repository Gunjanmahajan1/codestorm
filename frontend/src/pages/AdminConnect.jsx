import { useEffect, useState } from "react";
import api from "../services/api";

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

      <input
        name="email"
        value={form.email ?? ""}
        placeholder="Email"
        onChange={handleChange}
      />

      <input
        name="linkedin"
        value={form.linkedin ?? ""}
        placeholder="LinkedIn URL"
        onChange={handleChange}
      />

      <input
        name="instagram"
        value={form.instagram ?? ""}
        placeholder="Instagram URL"
        onChange={handleChange}
      />

      <input
        name="whatsapp"
        value={form.whatsapp ?? ""}
        placeholder="WhatsApp Group Link"
        onChange={handleChange}
      />

      <button className="logout-btn" type="button" onClick={save}>
        Save Contact Details
      </button>
    </div>
  );
};

export default AdminConnect;
