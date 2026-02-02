
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/dashboard.css";
console.count("StudentEvents mounted");

const StudentEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/events/public"
      );
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
        <h1>CodeStrom Events 🚀</h1>
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
                {event.image && (
                  <img
                    src={`http://localhost:5000${event.image}`}
                    alt={event.title}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      marginBottom: "0.75rem",
                    }}
                  />
                )}

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
    </div>
  );
};

export default StudentEvents;
