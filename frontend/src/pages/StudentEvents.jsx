import { useEffect, useState } from "react";
import api, { API_BASE_URL } from "../services/api";
import "../styles/dashboard.css";
import { FaTimes } from "react-icons/fa";

const StudentEvents = () => {
  const [events, setEvents] = useState([]);
  const [sliderImages, setSliderImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchEvents(), fetchSliderImages()]);
      setLoading(false);
    };
    loadAll();
  }, []);

  const fetchSliderImages = async () => {
    try {
      const res = await api.get("/api/events-slider");
      setSliderImages(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch slider images", err);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await api.get("/api/events/public");
      setEvents(res.data.data || res.data);
    } catch (error) {
      console.error("Failed to load events", error);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + sliderImages.length) % sliderImages.length
    );
  };

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <h1>CodeStorm Events 🚀</h1>
        <p>Explore our latest workshops, contests, and tech events.</p>

        {/* SLIDING PHOTOS */}
        {sliderImages.length > 0 && (
          <div
            style={{
              marginTop: "2rem",
              position: "relative",
              width: "100%",
              maxWidth: "1000px",
              height: "400px",
              margin: "2rem auto",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {sliderImages.map((img, index) => (
              <div
                key={img._id}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: index === currentSlide ? 1 : 0,
                  transition: "opacity 0.8s ease-in-out",
                }}
              >
                <img
                  src={`${API_BASE_URL}${img.imageUrl}`}
                  alt={`Slide ${index}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "100px",
                    background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                  }}
                />
              </div>
            ))}

            {/* Navigation Arrows */}
            {sliderImages.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  style={{
                    position: "absolute",
                    left: "20px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(0,0,0,0.5)",
                    color: "white",
                    border: "none",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    zIndex: 15,
                    fontSize: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "0.2s",
                  }}
                >
                  ❮
                </button>
                <button
                  onClick={nextSlide}
                  style={{
                    position: "absolute",
                    right: "20px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(0,0,0,0.5)",
                    color: "white",
                    border: "none",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    zIndex: 15,
                    fontSize: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "0.2s",
                  }}
                >
                  ❯
                </button>
              </>
            )}

            {/* Slide Indicators */}
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "10px",
                zIndex: 10,
              }}
            >
              {sliderImages.map((_, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background:
                      index === currentSlide
                        ? "#22c55e"
                        : "rgba(255,255,255,0.5)",
                    cursor: "pointer",
                    transition: "0.3s",
                  }}
                />
              ))}
            </div>
          </div>
        )}

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

