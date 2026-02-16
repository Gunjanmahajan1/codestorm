
import { useEffect, useState, useRef } from "react";
import api, { API_BASE_URL } from "../services/api";
import "../styles/dashboard.css";

const AdminEvents = () => {
  // ---------------- STATE ----------------
  const [events, setEvents] = useState([]);
  const [sliderImages, setSliderImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEventId, setEditingEventId] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [sliderImage, setSliderImage] = useState(null);
  const [sliderOrder, setSliderOrder] = useState(0);
  const [uploadingSlider, setUploadingSlider] = useState(false);
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
      const res = await api.get("/api/events");
      setEvents(res.data.data || res.data);
    }
    catch (err) {
      console.error("Failed to fetch events");
    }
  };

  const fetchSliderImages = async () => {
    try {
      const res = await api.get("/api/events-slider");
      setSliderImages(res.data.data || []);
    } catch (err) {
      console.error("Failed to load slider images", err);
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let targetEventId = editingEventId;

      if (editingEventId) {
        // 🔁 EDIT EVENT
        await api.put(`/api/events/${editingEventId}`, form);
      } else {
        // ➕ CREATE EVENT
        const publishNow = window.confirm(
          "Do you want to publish this event now?\n\nOK = Publish\nCancel = Save as Draft"
        );

        const payload = {
          ...form,
          isPublished: publishNow,
        };

        const res = await api.post("/api/events", payload);
        targetEventId = res.data.data._id;
      }

      // 👇 upload images if selected (for both Create and Edit)
      if (targetEventId && imageFiles && imageFiles.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < imageFiles.length; i++) {
          formData.append("images", imageFiles[i]);
        }

        await api.post(
          `/api/events/${targetEventId}/image`,
          formData,
          {
            headers: {
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
      alert(
        error.response?.data?.message ||
        "Create/Edit failed"
      );
    }
  };

  const handleSliderSubmit = async (e) => {
    e.preventDefault();
    if (!sliderImage) return alert("Please select an image");

    setUploadingSlider(true);
    try {
      const formData = new FormData();
      formData.append("image", sliderImage);
      formData.append("order", sliderOrder);

      await api.post("/api/events-slider", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSliderImage(null);
      setSliderOrder(0);
      e.target.reset();
      fetchSliderImages();
    } catch (error) {
      console.error("Failed to upload slider image", error);
      alert("Failed to upload image");
    } finally {
      setUploadingSlider(false);
    }
  };

  const handleDeleteSlider = async (id) => {
    if (!window.confirm("Delete this slider image?")) return;
    try {
      await api.delete(`/api/events-slider/${id}`);
      fetchSliderImages();
    } catch (error) {
      console.error("Failed to delete slider image", error);
    }
  };

  const handleDelete = async (eventId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/api/events/${eventId}`);
      // Refresh events after delete
      fetchEvents();
    } catch (error) {
      console.error("Failed to delete event", error);
    }
  };


  // ---------------- EFFECT ----------------
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchEvents(), fetchSliderImages()]);
      setLoading(false);
    };
    loadAll();
  }, []);

  // ---------------- UI ----------------
  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <h1>Manage Events</h1>
        <p>Create, view, and delete club events.</p>

        {/* 1st: SLIDER PHOTOS */}
        <div className="card" style={{ marginTop: "2rem" }}>
          <h3>1. Events Page Slider (Top Images)</h3>
          <p style={{ fontSize: "0.9rem", opacity: 0.7, marginBottom: "1.5rem" }}>Upload multiple images that will appear as a carousel at the top of the events page.</p>

          <form onSubmit={handleSliderSubmit} style={{ display: "flex", gap: "1rem", alignItems: "flex-end", flexWrap: "wrap", marginBottom: "2rem" }}>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "0.85rem" }}>Upload Image</label>
              <input
                type="file"
                onChange={(e) => setSliderImage(e.target.files[0])}
                accept="image/*"
                required
                style={{ color: "white", width: "100%" }}
              />
            </div>
            <div style={{ width: "100px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "0.85rem" }}>Order</label>
              <input
                type="number"
                value={sliderOrder}
                onChange={(e) => setSliderOrder(e.target.value)}
                style={{ padding: "8px", width: "100%" }}
              />
            </div>
            <button className="logout-btn" type="submit" disabled={uploadingSlider} style={{ height: "40px" }}>
              {uploadingSlider ? "Uploading..." : "Add Photo"}
            </button>
          </form>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "1rem" }}>
            {sliderImages.map((img) => (
              <div key={img._id} style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: "1px solid #334155", background: "#1e293b" }}>
                <img
                  src={`${API_BASE_URL}${img.imageUrl}`}
                  alt="Slider"
                  style={{ width: "100%", height: "100px", objectFit: "cover" }}
                />
                <div style={{ padding: "5px", textAlign: "center", fontSize: "12px" }}>Order: {img.order}</div>
                <button
                  onClick={() => handleDeleteSlider(img._id)}
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    background: "rgba(220, 38, 38, 0.9)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 2nd: MANAGE INDIVIDUAL EVENTS */}
        <div style={{ marginTop: "3rem" }}>
          <h2 style={{ marginBottom: "1rem" }}>2. Individual Events</h2>
        </div>

        {/* CREATE EVENT FORM */}
        <form
          onSubmit={handleSubmit}
          className="card"
          style={{ marginTop: "1.5rem" }}
        >
          <h3>{editingEventId ? "Edit Event" : "Create New Event"}</h3>
          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt={form.title}
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
                <div style={{ display: "flex", gap: "10px", overflowX: "auto", marginBottom: "0.5rem", padding: "5px 0" }}>
                  {(event.images && event.images.length > 0 ? event.images : event.image ? [event.image] : []).map((img, idx) => (
                    <div key={idx} style={{ position: "relative", width: "120px", height: "80px", flexShrink: 0 }}>
                      <img
                        src={img.startsWith('http') ? img : `${API_BASE_URL}${img}`}
                        alt={`${event.title}-${idx}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                      <button
                        onClick={async () => {
                          if (!window.confirm("Delete this photo?")) return;
                          try {
                            await api.delete(`/api/events/${event._id}/image`, {
                              data: { imagePath: img }
                            });
                            fetchEvents();
                          } catch (err) {
                            console.error("Failed to delete image", err);
                            alert("Failed to delete image");
                          }
                        }}
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                          background: "rgba(239, 68, 68, 0.9)", // red
                          color: "white",
                          border: "none",
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>


                <button
                  onClick={async () => {
                    await api.patch(`/api/events/${event._id}/publish`);
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

