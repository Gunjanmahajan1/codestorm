import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/dashboard.css";
import { SiCodeforces, SiCodechef, SiLeetcode } from "react-icons/si";

const Contests = () => {
  /* ---------------- STATE ---------------- */
  const [contests, setContests] = useState([]);

  /* ---------------- PLATFORMS ---------------- */
  const platforms = [
    {
      name: "Codeforces",
      url: "https://codeforces.com/contests",
      color: "#1F8ACB",
      description: "Rated rounds & global contests",
      icon: <SiCodeforces color="#1F8ACB" size={26} />,
    },
    {
      name: "CodeChef",
      url: "https://www.codechef.com/contests",
      color: "#7b6455",
      description: "Monthly, long & lunchtime contests",
      icon: <SiCodechef color="#5B4638" size={26} />,
    },
    {
      name: "LeetCode",
      url: "https://leetcode.com/contest/",
      color: "#FFA116",
      description: "Weekly & Biweekly coding contests",
      icon: <SiLeetcode color="#FFA116" size={26} />,
    },
  ];

  /* ---------------- CALENDAR REMINDER ---------------- */
  const downloadICS = (contest) => {
    const start = new Date(contest.date || new Date());
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

    const formatICS = (d) =>
      d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const ics = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CodeStorm//Contest Reminder//EN
BEGIN:VEVENT
UID:${Date.now()}@codestorm
DTSTAMP:${formatICS(new Date())}
DTSTART:${formatICS(start)}
DTEND:${formatICS(end)}
SUMMARY:${contest.title}
DESCRIPTION:Contest Reminder from CodeStorm
LOCATION:${contest.url || ""}
END:VEVENT
END:VCALENDAR
`;

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${contest.title.replace(/\s+/g, "_")}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /* ---------------- FETCH INTERNAL CONTESTS ---------------- */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/contests")
      .then((res) => setContests(res.data.data || []))
      .catch(() => setContests([]));
  }, []);

  /* ---------------- UI ---------------- */
  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <h1>Contests 🏆</h1>

        <p style={{ opacity: 0.8, marginBottom: "1rem" }}>
          Your comfort zone is quietly killing your potential.
          <br />
          Do it tired. Do it bored. Just do it. Stay consistent.
        </p>

        {/* PLATFORM CARDS */}
        <div className="card-grid">
          {platforms.map((p, i) => (
            <a
              key={i}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="card" style={{ cursor: "pointer" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                  }}
                >
                  {p.icon}
                  <h3 style={{ margin: 0 }}>{p.name}</h3>
                </div>

                <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                  {p.description}
                </p>

                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="logout-btn"
                  style={{
                    background: p.color,
                    textAlign: "center",
                    marginTop: "0.6rem",
                    display: "block",
                  }}
                >
                  View Contests →
                </a>

              </div>
            </a>
          ))}
        </div>

        {/* INTERNAL CONTESTS */}
        <h2 style={{ marginTop: "2.5rem" }}>📌 CodeStorm Contests</h2>

        {contests.length === 0 ? (
          <p>No contests added by CodeStorm yet.</p>
        ) : (
          <div className="card-grid">
            {contests.map((c) => (
              <div key={c._id} className="card">
                <h3>{c.title}</h3>
                <p>{c.description}</p>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(c.date).toLocaleDateString()}
                </p>

                <button
                  className="logout-btn"
                  onClick={() => downloadICS(c)}
                  style={{ marginTop: "0.5rem" }}
                >
                  Add to Calendar 📅
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contests;
