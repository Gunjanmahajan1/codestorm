
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StudentEvents from "./StudentEvents";
import Connect from "./Connect";
import About from "./About";

const LandingPage = () => {
    const location = useLocation();
    const eventsRef = useRef(null);
    const contactRef = useRef(null);
    const aboutRef = useRef(null);
    const coreCommitteeRef = useRef(null);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    useEffect(() => {
        // Only redirect if visiting the root without a specific section hash
        if (token && !location.hash) {
            if (role === "admin") {
                navigate("/dashboard");
            } else {
                navigate("/discussion");
            }
        }
    }, [token, role, navigate, location.hash]);

    useEffect(() => {
        if (location.hash === "#events") {
            eventsRef.current?.scrollIntoView({ behavior: "smooth" });
        } else if (location.hash === "#about") {
            aboutRef.current?.scrollIntoView({ behavior: "smooth" });
        } else if (location.hash === "#core-committee") {
            coreCommitteeRef.current?.scrollIntoView({ behavior: "smooth" });
        } else if (location.hash === "#contact") {
            contactRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [location]);

    return (
        <div className="landing-page">
            <section id="events" ref={eventsRef} style={{ scrollMarginTop: "100px" }}>
                <StudentEvents />
            </section>

            <section id="about" ref={aboutRef} style={{ scrollMarginTop: "100px" }}>
                <About />
            </section>

            <div ref={coreCommitteeRef} style={{ scrollMarginTop: "100px" }} />

            <section id="contact" ref={contactRef} style={{ scrollMarginTop: "100px" }}>
                <Connect />
            </section>
        </div>
    );
};

export default LandingPage;
