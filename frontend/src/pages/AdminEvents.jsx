
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../styles/dashboard.css";

const AdminEvents = () => {
  // ---------------- STATE ----------------
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEventId, setEditingEventId] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const fileInputRef = useRef(null);


  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    year: "",
    location: "",
    eventType: "",
    isPublished: true,
  });

  // ---------------- HELPERS ----------------
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/events",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEvents(res.data.data || res.data);
      setLoading(false);
    }
    catch (err) {
      console.error("Failed to fetch events");
      console.error("STATUS:", err.response?.status);
      console.error("DATA:", err.response?.data);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      let targetEventId = editingEventId;

      if (editingEventId) {
        // 🔁 EDIT EVENT
        await axios.put(
          `http://localhost:5000/api/events/${editingEventId}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // ➕ CREATE EVENT
        const publishNow = window.confirm(
          "Do you want to publish this event now?\n\nOK = Publish\nCancel = Save as Draft"
        );

        const payload = {
          ...form,
          isPublished: publishNow,
        };

        const res = await axios.post(
          "http://localhost:5000/api/events",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        targetEventId = res.data.data._id;
      }

      // 👇 upload images if selected (for both Create and Edit)
      if (targetEventId && imageFiles && imageFiles.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < imageFiles.length; i++) {
          formData.append("images", imageFiles[i]);
        }

        await axios.post(
          `http://localhost:5000/api/events/${targetEventId}/image`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      // Reset form & edit mode
      setForm({
        title: "",
        description: "",
        date: "",
        year: "",
        location: "",
        eventType: "",
        isPublished: true,
      });
      setEditingEventId(null);
      setImageFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";

      fetchEvents();
    } catch (error) {
      console.error("Failed to save event");
      console.error("STATUS:", error.response?.status);
      console.error("DATA:", error.response?.data);

      alert(
        error.response?.data?.message ||
        "Create/Edit failed – check backend route or validation"
      );
    }
  };

  const handleDelete = async (eventId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/events/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh events after delete
      fetchEvents();
    } catch (error) {
      console.error("Failed to delete event", error);
    }
  };


  // ---------------- EFFECT ----------------
  useEffect(() => {
    fetchEvents();
  }, []);

  // ---------------- UI ----------------
  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <h1>Manage Events</h1>
        <p>Create, view, and delete club events.</p>

        {/* CREATE EVENT FORM */}
        <form
          onSubmit={handleSubmit}
          className="card"
          style={{ marginTop: "1.5rem" }}
        >
          <h3>{editingEventId ? "Edit Event" : "Create New Event"}</h3>
          {event.imageUrl && (


            <img
              src={event.imageUrl}
              alt={event.title}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                borderRadius: "10px",
                marginBottom: "0.5rem",
              }}
            />
          )}


          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={form.title}
            onChange={handleInputChange}
            required
            style={{ width: "100%", marginBottom: "1rem", padding: "10px" }}
          />

          <textarea
            name="description"
            placeholder="Event Description"
            value={form.description}
            onChange={handleInputChange}
            required
            style={{ width: "100%", marginBottom: "1rem", padding: "10px" }}
          />

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleInputChange}
            required
            style={{ width: "100%", marginBottom: "1rem", padding: "10px" }}
          />

          <input
            type="text"
            name="location"
            placeholder="Event Location (e.g. Online / Auditorium)"
            value={form.location}
            onChange={handleInputChange}
            required
            style={{ width: "100%", marginBottom: "1rem", padding: "10px" }}
          />

          <input
            type="number"
            name="year"
            placeholder="Event Year (e.g. 2025)"
            value={form.year}
            onChange={handleInputChange}
            required
            style={{ width: "100%", marginBottom: "1rem", padding: "10px" }}
          />


          <input
            type="text"
            name="eventType"
            placeholder="Event Type"
            value={form.eventType}
            onChange={handleInputChange}
            required
            style={{ width: "100%", marginBottom: "1rem", padding: "10px" }}
          />
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={(e) => setImageFiles(Array.from(e.target.files))}
            style={{ marginBottom: "1rem" }}
          />



          <button className="logout-btn" type="submit">
            Create Event
          </button>
        </form>

        {/* EVENTS LIST */}
        {loading ? (
          <p>Loading events...</p>
        ) : events.length === 0 ? (
          <p>No events created yet.</p>
        ) : (
          <div className="card-grid" style={{ marginTop: "2rem" }}>
            {events.map((event) => (
              <div
                className="card"
                key={event._id}
                style={{ opacity: event.isPublished ? 1 : 0.7 }}
              >




                <button
                  onClick={() => {
                    setForm({
                      title: event.title,
                      description: event.description,
                      date: event.date?.slice(0, 10),
                      year: event.year,
                      location: event.location,
                      eventType: event.eventType,
                    });
                    setEditingEventId(event._id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  style={{
                    marginTop: "1rem",
                    marginRight: "0.5rem",
                    background: "#2563EB",
                    color: "#fff",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>


                <button
                  type="button"
                  onClick={() => handleDelete(event._id)}
                  style={{
                    marginTop: "1rem",
                    background: "#DC2626",
                    color: "#fff",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
                {/* IMAGES DISPLAY */}
                {event.images && event.images.length > 0 ? (
                  <div style={{ display: "flex", gap: "8px", overflowX: "auto", marginBottom: "0.5rem" }}>
                    {event.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={`http://localhost:5000${img}`}
                        alt={`${event.title}-${idx}`}
                        style={{
                          width: "100px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          flexShrink: 0
                        }}
                      />
                    ))}
                  </div>
                ) : event.image ? (
                  <img
                    src={`http://localhost:5000${event.image}`}
                    alt={event.title}
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      marginBottom: "0.5rem",
                    }}
                  />
                ) : null}

                <button
                  onClick={async () => {
                    const token = localStorage.getItem("token");

                    await axios.patch(
                      `http://localhost:5000/api/events/${event._id}/publish`,
                      {},
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );

                    fetchEvents(); // refresh list
                  }}
                  style={{
                    marginTop: "0.5rem",
                    background: event.isPublished ? "#F59E0B" : "#16A34A",
                    color: "#fff",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  {event.isPublished ? "Unpublish" : "Publish"}
                </button>


                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p>
                  <strong>Date:</strong> {event.date}
                </p>
                <p>
                  <strong>Type:</strong> {event.eventType}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEvents;
