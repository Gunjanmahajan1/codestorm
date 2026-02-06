import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/dashboard.css";

const AdminContests = () => {
  const [contests, setContests] = useState([]);
  const token = localStorage.getItem("token");

  const fetchContests = async () => {
    const res = await axios.get("http://localhost:5000/api/contests");
    setContests(res.data.data || []);
  };

  useEffect(() => {
    fetchContests();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contest?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/contests/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchContests();
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete contest");
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <h1>Admin Contests</h1>
        <h2>Create Contest</h2>

        <form
          className="card"
          onSubmit={async (e) => {
            e.preventDefault();

            const token = localStorage.getItem("token");

            await axios.post(
              "http://localhost:5000/api/contests",
              {
                title: e.target.title.value,
                description: e.target.description.value,
                date: e.target.date.value,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            e.target.reset();
            fetchContests();
          }}
        >
          <input
            name="title"
            placeholder="Contest Title"
            required
            style={{ width: "100%", marginBottom: "1rem" }}
          />

          <textarea
            name="description"
            placeholder="Contest Description"
            required
            style={{ width: "100%", marginBottom: "1rem" }}
          />

          <input
            type="date"
            name="date"
            required
            style={{ width: "100%", marginBottom: "1rem" }}
          />

          <button className="logout-btn">Create Contest</button>
        </form>

        {contests.map(c => (
          <div key={c._id} className="card" style={{ position: 'relative' }}>
            <h3>{c.title}</h3>
            <p>{c.description}</p>
            <p><strong>Date: </strong>{new Date(c.date).toLocaleDateString()}</p>
            <button
              onClick={() => handleDelete(c._id)}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Delete Contest
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminContests;
