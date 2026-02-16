import { useEffect, useState } from "react";
import api, { API_BASE_URL } from "../services/api";
import "../styles/dashboard.css";

const About = () => {
  const [members, setMembers] = useState([]);
  const [sliderImages, setSliderImages] = useState([]);
  const [aboutContent, setAboutContent] = useState({ committeeTitle: "Core Committee 2025-26" });
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Fetch committee members
    api.get("/api/core-team")
      .then((res) => {
        setMembers(res.data.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch committee members", err);
      });

    // Fetch slider images
    api.get("/api/about-slider")
      .then((res) => {
        setSliderImages(res.data.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch slider images", err);
      });

    // Fetch about content (title)
    api.get("/api/about-content")
      .then((res) => {
        if (res.data.data) {
          setAboutContent(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch about content", err);
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
                  src={`${API_BASE_URL}${img.imageUrl}`}
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
          {aboutContent.committeeTitle}
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
          <h2 style={{ color: "#22c55e", marginBottom: "1.5rem" }}>CodeStorm Club MESCOE</h2>

          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#22c55e", fontSize: "1.3rem", marginBottom: "0.5rem" }}>Overview</h3>
            <p style={{ lineHeight: "1.8", fontSize: "1.1rem" }}>
              CodeStorm Club is a Coding and Technology related club at MESCOE
            </p>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#22c55e", fontSize: "1.3rem", marginBottom: "0.5rem" }}>Vision:</h3>
            <p style={{ lineHeight: "1.8", fontSize: "1.1rem" }}>
              To ensure that students acquire and use knowledge and coding skills to become creative and successful members of society.
            </p>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#22c55e", fontSize: "1.3rem", marginBottom: "0.5rem" }}>Mission:</h3>
            <ul style={{ lineHeight: "1.8", fontSize: "1.1rem", paddingLeft: "1.5rem", listStyleType: "disc" }}>
              <li>To foster an environment of learning and sharing to help students achieve their career objectives.</li>
              <li>To make the members of the club better at coding, faster at program solving and more aware of the current situation in the computer world.</li>
            </ul>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#22c55e", fontSize: "1.3rem", marginBottom: "0.5rem" }}>Objectives:</h3>
            <ul style={{ lineHeight: "1.8", fontSize: "1.1rem", paddingLeft: "1.5rem", listStyleType: "disc" }}>
              <li>Be a forum for interaction among students of the institute.</li>
              <li>Help to increase coding literacy.</li>
              <li>To develop coding skills to crack technical rounds of any company.</li>
              <li>To spread awareness about competitive programming.</li>
            </ul>
          </div>

          <div style={{ marginTop: "3rem", borderTop: "1px solid rgba(34, 197, 94, 0.3)", paddingTop: "1.5rem" }}>
            <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
              Founder: <span style={{ color: "#22c55e" }}>Sandesh Pabitwar</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
