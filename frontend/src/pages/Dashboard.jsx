import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    upcoming: 0,
    past: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/events");

        const events = res.data.data || [];
        const today = new Date();

        setStats({
          total: events.length,
          published: events.filter((e) => e.isPublished).length,
          drafts: events.filter((e) => !e.isPublished).length,
          upcoming: events.filter(
            (e) => new Date(e.date) >= today
          ).length,
          past: events.filter(
            (e) => new Date(e.date) < today
          ).length,
        });
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      }
    };

    fetchStats();
  }, []);


  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <h1>CodeStorm Dashboard 🚀</h1>
        <p>Quick overview of CodeStorm activities</p>

        <div className="card-grid">
          <div className="card">
            <h3>Total Events</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>
              {stats.total}
            </p>
          </div>

          <div className="card">
            <h3>Published</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold", color: "#16A34A" }}>
              {stats.published}
            </p>
          </div>

          <div className="card">
            <h3>Drafts</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold", color: "#F59E0B" }}>
              {stats.drafts}
            </p>
          </div>

          <div className="card">
            <h3>Upcoming</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold", color: "#2563EB" }}>
              {stats.upcoming}
            </p>
          </div>

          <div className="card">
            <h3>Past</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold", color: "#DC2626" }}>
              {stats.past}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
