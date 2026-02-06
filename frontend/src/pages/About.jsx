import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/dashboard.css";

const About = () => {
  const [members, setMembers] = useState([]);
  const [sliderImages, setSliderImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Fetch committee members
    axios
      .get("http://localhost:5000/api/core-team")
      .then((res) => {
        setMembers(res.data.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch committee members", err);
      });

    // Fetch slider images
    axios
      .get("http://localhost:5000/api/about-slider")
      .then((res) => {
        setSliderImages(res.data.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch slider images", err);
      });
  }, []);

  /* ---------------- HANDLERS ---------------- */
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <h1>About CodeStorm 🚀</h1>

        {/* 1st: SLIDING PHOTOS */}
        {sliderImages.length > 0 && (
          <div style={{
            marginTop: "2rem",
            position: "relative",
            width: "100%",
            maxWidth: "1000px",
            height: "450px",
            margin: "2rem auto",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
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
                  src={`http://localhost:5000${img.imageUrl}`}
                  alt={`Slide ${index}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
                <div style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "100px",
                  background: "linear-gradient(transparent, rgba(0,0,0,0.8))"
                }} />
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
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    zIndex: 15,
                    fontSize: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "0.2s"
                  }}
                  onMouseEnter={(e) => e.target.style.background = "#22c55e"}
                  onMouseLeave={(e) => e.target.style.background = "rgba(0,0,0,0.5)"}
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
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    zIndex: 15,
                    fontSize: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "0.2s"
                  }}
                  onMouseEnter={(e) => e.target.style.background = "#22c55e"}
                  onMouseLeave={(e) => e.target.style.background = "rgba(0,0,0,0.5)"}
                >
                  ❯
                </button>
              </>
            )}

            {/* Slide Indicators */}
            <div style={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "10px",
              zIndex: 10
            }}>
              {sliderImages.map((_, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: index === currentSlide ? "#22c55e" : "rgba(255,255,255,0.5)",
                    cursor: "pointer",
                    transition: "0.3s"
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* 2nd: CORE COMMITTEE TABLES */}
        <h2 style={{ marginTop: "3rem", marginBottom: "1rem", textAlign: "center", color: "#22c55e" }}>
          Core Committee 2025-26
        </h2>

        {members.length > 0 ? (
          <div className="card" style={{ padding: "0", overflow: "hidden", border: "none", maxWidth: "800px", margin: "0 auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "400px" }}>
              <thead>
                <tr style={{ background: "#22c55e", color: "#020617", textAlign: "left" }}>
                  <th style={{ padding: "12px 20px", width: "40%" }}>Designation</th>
                  <th style={{ padding: "12px 20px", width: "60%" }}>Name of Member</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m, index) => (
                  <tr
                    key={m._id}
                    style={{
                      background: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                      color: "#333",
                      borderBottom: "1px solid #eee"
                    }}
                  >
                    <td style={{ padding: "12px 20px", fontWeight: "600" }}>{m.designation}</td>
                    <td style={{ padding: "12px 20px", fontWeight: "600" }}>{m.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ textAlign: "center", fontStyle: "italic", opacity: 0.7 }}>
            Committee members to be announced soon.
          </p>
        )}

        {/* 3rd: ABOUT WRITTEN PARA */}
        <div style={{ marginTop: "4rem", maxWidth: "900px", margin: "4rem auto" }}>
          <p style={{ marginTop: "1rem", lineHeight: "1.8", fontSize: "1.1rem" }}>
            <strong>CodeStorm</strong> is the official technical club focused on
            programming, problem-solving, and modern software development.
          </p>

          <p style={{ marginTop: "1rem", lineHeight: "1.8", fontSize: "1.1rem" }}>
            Our mission is to create a strong coding culture by organizing
            workshops, contests, hackathons, and collaborative learning sessions.
          </p>

          <p style={{ marginTop: "1rem", lineHeight: "1.8", fontSize: "1.1rem" }}>
            We believe in learning by building, sharing knowledge, and growing
            together as a tech community.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
