import { useEffect, useState } from "react";
import api, { API_BASE_URL } from "../services/api";
import "../styles/dashboard.css";
import { FaTimes } from "react-icons/fa";

const StudentEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/api/events/public");
      setEvents(res.data.data || res.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load events", error);
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <h1>CodeStorm Events 🚀</h1>
        <p>Explore our latest workshops, contests, and tech events.</p>

        {loading ? (
          <p>Loading events...</p>
        ) : events.length === 0 ? (
          <p>No events available right now.</p>
        ) : (
          <div className="card-grid" style={{ marginTop: "2rem" }}>
            {events.map((event) => (
              <div className="card" key={event._id}>
                {/* EVENT IMAGE */}
                {event.images && event.images.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      overflowX: "auto",
                      scrollSnapType: "x mandatory", // Enable snap scrolling
                      gap: "0.5rem",
                      marginBottom: "0.75rem",
                      borderRadius: "10px",
                      paddingBottom: "5px"
                    }}
                  >
                    {event.images.map((img, index) => (
                      <img
                        key={index}
                        src={`${API_BASE_URL}${img}`}
                        alt={`${event.title} ${index + 1}`}
                        onClick={() => setSelectedImage(`${API_BASE_URL}${img}`)}
                        style={{
                          minWidth: "100%", // Take up full card width
                          scrollSnapAlign: "start", // Snap to start
                          height: "200px", // Increased height
                          objectFit: "cover",
                          borderRadius: "10px",
                          cursor: "pointer"
                        }}
                      />
                    ))}
                  </div>
                ) : event.image ? (
                  <img
                    src={`${API_BASE_URL}${event.image}`}
                    alt={event.title}
                    onClick={() => setSelectedImage(`${API_BASE_URL}${event.image}`)}
                    style={{
                      width: "100%",
                      height: "200px", // Increased height
                      objectFit: "cover",
                      borderRadius: "10px",
                      marginBottom: "0.75rem",
                      cursor: "pointer"
                    }}
                  />
                ) : null}

                <h3>{event.title}</h3>
                <p>{event.description}</p>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(event.date).toDateString()}
                </p>

                <p>
                  <strong>Year:</strong> {event.year}
                </p>

                <p>
                  <strong>Location:</strong> {event.location}
                </p>

                <p>
                  <strong>Type:</strong> {event.eventType}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setSelectedImage(null)}
        >
          <div style={{ position: "relative", maxWidth: "90%", maxHeight: "90%" }}>
            <img
              src={selectedImage}
              alt="Full size"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "85vh",
                objectFit: "contain",
                borderRadius: "8px",
                boxShadow: "0 0 20px rgba(0,0,0,0.5)"
              }}
            />
            <button
              onClick={() => setSelectedImage(null)}
              style={{
                position: "absolute",
                top: "-40px",
                right: "0",
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "2rem",
                cursor: "pointer"
              }}
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentEvents;

