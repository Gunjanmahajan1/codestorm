
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import StudentEvents from "./StudentEvents";
import Connect from "./Connect";
import About from "./About";

const LandingPage = () => {
    const location = useLocation();
    const eventsRef = useRef(null);
    const contactRef = useRef(null);
    const aboutRef = useRef(null);

    useEffect(() => {
        if (location.hash === "#events") {
            eventsRef.current?.scrollIntoView({ behavior: "smooth" });
        } else if (location.hash === "#contact") {
            contactRef.current?.scrollIntoView({ behavior: "smooth" });
        } else if (location.hash === "#about") {
            aboutRef.current?.scrollIntoView({ behavior: "smooth" });
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

            <section id="contact" ref={contactRef} style={{ scrollMarginTop: "100px" }}>
                <Connect />
            </section>
        </div>
    );
};

export default LandingPage;
