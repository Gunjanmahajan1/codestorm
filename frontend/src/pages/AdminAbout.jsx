import { useEffect, useState } from "react";
import api, { API_BASE_URL } from "../services/api";
import "../styles/dashboard.css";

const AdminAbout = () => {
    const [members, setMembers] = useState([]);
    const [sliderImages, setSliderImages] = useState([]);
    const [aboutContent, setAboutContent] = useState({ committeeTitle: "" });
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [savingContent, setSavingContent] = useState(false);

    const [form, setForm] = useState({
        designation: "",
        name: "",
        order: 0,
    });

    const [sliderImage, setSliderImage] = useState(null);
    const [sliderOrder, setSliderOrder] = useState(0);

    const fetchMembers = async () => {
        try {
            const res = await api.get("/api/core-team");
            setMembers(res.data.data || []);
        } catch (err) {
            console.error("Failed to load members", err);
        }
    };

    const fetchSliderImages = async () => {
        try {
            const res = await api.get("/api/about-slider");
            setSliderImages(res.data.data || []);
        } catch (err) {
            console.error("Failed to load slider images", err);
        }
    };

    const fetchAboutContent = async () => {
        try {
            const res = await api.get("/api/about-content");
            if (res.data.data) {
                setAboutContent(res.data.data);
            }
        } catch (err) {
            console.error("Failed to load about content", err);
        }
    };

    useEffect(() => {
        const loadAll = async () => {
            setLoading(true);
            await Promise.all([fetchMembers(), fetchSliderImages(), fetchAboutContent()]);
            setLoading(false);
        };
        loadAll();
    }, []);

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleContentSubmit = async (e) => {
        e.preventDefault();
        setSavingContent(true);
        try {
            await api.put("/api/about-content", { committeeTitle: aboutContent.committeeTitle });
            alert("About content updated!");
        } catch (error) {
            console.error("Failed to save about content", error);
            alert("Failed to save about content");
        } finally {
            setSavingContent(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/api/core-team/${editingId}`, form);
            } else {
                await api.post("/api/core-team", form);
            }

            setForm({ designation: "", name: "", order: 0 });
            setEditingId(null);
            fetchMembers();
        } catch (error) {
            console.error("Failed to save member", error);
            alert("Failed to save member");
        }
    };

    const handleSliderSubmit = async (e) => {
        e.preventDefault();
        if (!sliderImage) return alert("Please select an image");

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("image", sliderImage);
            formData.append("order", sliderOrder);

            await api.post("/api/about-slider", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setSliderImage(null);
            setSliderOrder(0);
            e.target.reset();
            fetchSliderImages();
        } catch (error) {
            console.error("Failed to upload slider image", error);
            alert("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteSlider = async (id) => {
        if (!window.confirm("Delete this slider image?")) return;
        try {
            await api.delete(`/api/about-slider/${id}`);
            fetchSliderImages();
        } catch (error) {
            console.error("Failed to delete slider image", error);
        }
    };

    const handleEdit = (member) => {
        setForm({
            designation: member.designation,
            name: member.name,
            order: member.order,
        });
        setEditingId(member._id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this member?")) return;
        try {
            await api.delete(`/api/core-team/${id}`);
            fetchMembers();
        } catch (error) {
            console.error("Failed to delete member", error);
        }
    };


    return (
        <div className="dashboard">
            <div className="dashboard-content">
                <h1>Manage About Page Content</h1>
                <p>Manage slider photos and core committee members for the About page.</p>

                {/* 0: ABOUT PAGE SETTINGS (Title) */}
                <div className="card" style={{ marginTop: "2rem" }}>
                    <h3>0. About Page Settings</h3>
                    <p style={{ fontSize: "0.9rem", opacity: 0.7, marginBottom: "1.5rem" }}>Update the section titles for the About page.</p>

                    <form onSubmit={handleContentSubmit} style={{ display: "flex", gap: "1rem", alignItems: "flex-end", flexWrap: "wrap", marginBottom: "1rem" }}>
                        <div style={{ flex: 1, minWidth: "300px" }}>
                            <label style={{ display: "block", marginBottom: "5px", fontSize: "0.85rem" }}>Committee Section Title</label>
                            <input
                                type="text"
                                value={aboutContent.committeeTitle}
                                onChange={(e) => setAboutContent({ ...aboutContent, committeeTitle: e.target.value })}
                                placeholder="e.g. Core Committee 2025-26"
                                required
                                style={{ padding: "10px", width: "100%" }}
                            />
                        </div>
                        <button className="logout-btn" type="submit" disabled={savingContent} style={{ height: "40px" }}>
                            {savingContent ? "Saving..." : "Update Title"}
                        </button>
                    </form>
                </div>

                {/* 1st: SLIDER PHOTOS */}
                <div className="card" style={{ marginTop: "2.5rem" }}>
                    <h3>1. Sliding Photos (Carousel)</h3>
                    <p style={{ fontSize: "0.9rem", opacity: 0.7, marginBottom: "1.5rem" }}>Upload photos that will scroll at the top of the About page.</p>

                    <form onSubmit={handleSliderSubmit} style={{ display: "flex", gap: "1rem", alignItems: "flex-end", flexWrap: "wrap", marginBottom: "2rem" }}>
                        <div style={{ flex: 1, minWidth: "200px" }}>
                            <label style={{ display: "block", marginBottom: "5px", fontSize: "0.85rem" }}>Upload Image</label>
                            <input
                                type="file"
                                onChange={(e) => setSliderImage(e.target.files[0])}
                                accept="image/*"
                                required
                                style={{ color: "white", width: "100%" }}
                            />
                        </div>
                        <div style={{ width: "100px" }}>
                            <label style={{ display: "block", marginBottom: "5px", fontSize: "0.85rem" }}>Order</label>
                            <input
                                type="number"
                                value={sliderOrder}
                                onChange={(e) => setSliderOrder(e.target.value)}
                                style={{ padding: "8px", width: "100%" }}
                            />
                        </div>
                        <button className="logout-btn" type="submit" disabled={uploading} style={{ height: "40px" }}>
                            {uploading ? "Uploading..." : "Add Photo"}
                        </button>
                    </form>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "1rem" }}>
                        {sliderImages.map((img) => (
                            <div key={img._id} style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: "1px solid #334155", background: "#1e293b" }}>
                                <img
                                    src={`${API_BASE_URL}${img.imageUrl}`}
                                    alt="Slider"

                                    style={{ width: "100%", height: "100px", objectFit: "cover" }}
                                />
                                <div style={{ padding: "5px", textAlign: "center", fontSize: "12px" }}>Order: {img.order}</div>
                                <button
                                    onClick={() => handleDeleteSlider(img._id)}
                                    style={{
                                        position: "absolute",
                                        top: "5px",
                                        right: "5px",
                                        background: "rgba(220, 38, 38, 0.9)",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: "24px",
                                        height: "24px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "12px",
                                        cursor: "pointer",
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2nd: CORE COMMITTEE TABLE */}
                <div className="card" style={{ marginTop: "2.5rem" }}>
                    <h3>2. Core Committee Members</h3>
                    <p style={{ fontSize: "0.9rem", opacity: 0.7, marginBottom: "1.5rem" }}>Add or edit the committee members list.</p>

                    {/* ADD/EDIT FORM FOR MEMBERS */}
                    <form onSubmit={handleSubmit} style={{
                        background: "rgba(255,255,255,0.03)",
                        padding: "1.5rem",
                        borderRadius: "12px",
                        marginBottom: "2rem",
                        border: "1px solid rgba(255,255,255,0.05)"
                    }}>
                        <h4 style={{ marginBottom: "1rem" }}>{editingId ? "Update Member" : "Add New Member"}</h4>
                        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                            <input
                                type="text"
                                name="designation"
                                placeholder="Designation (e.g. Lead)"
                                value={form.designation}
                                onChange={handleInputChange}
                                required
                                style={{ padding: "10px", flex: 2, minWidth: "150px" }}
                            />
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={form.name}
                                onChange={handleInputChange}
                                required
                                style={{ padding: "10px", flex: 2, minWidth: "150px" }}
                            />
                            <input
                                type="number"
                                name="order"
                                placeholder="Order"
                                value={form.order}
                                onChange={handleInputChange}
                                style={{ padding: "10px", flex: 1, minWidth: "80px" }}
                            />
                            <button className="logout-btn" type="submit">
                                {editingId ? "Update" : "Add"}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingId(null);
                                        setForm({ designation: "", name: "", order: 0 });
                                    }}
                                    style={{ background: "#4B5563", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px" }}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>

                    {loading ? (
                        <p>Loading committee...</p>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: "#22c55e", color: "#020617" }}>
                                        <th style={{ padding: "12px", textAlign: "left" }}>Order</th>
                                        <th style={{ padding: "12px", textAlign: "left" }}>Designation</th>
                                        <th style={{ padding: "12px", textAlign: "left" }}>Name</th>
                                        <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.map((m) => (
                                        <tr key={m._id} style={{ borderBottom: "1px solid #334155" }}>
                                            <td style={{ padding: "12px" }}>{m.order}</td>
                                            <td style={{ padding: "12px", fontWeight: "600", color: "#22c55e" }}>{m.designation}</td>
                                            <td style={{ padding: "12px" }}>{m.name}</td>
                                            <td style={{ padding: "12px", textAlign: "right" }}>
                                                <button onClick={() => handleEdit(m)} style={{ marginRight: "0.5rem", background: "#2563EB", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px" }}>Edit</button>
                                                <button onClick={() => handleDelete(m._id)} style={{ background: "#DC2626", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px" }}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* 3rd: ABOUT WRITTEN PARA PREVIEW */}
                <div className="card" style={{ marginTop: "2.5rem", opacity: 0.8 }}>
                    <h3>3. About Section Paragraph</h3>
                    <p style={{ fontSize: "0.9rem", opacity: 0.7, marginBottom: "1rem" }}>Current text displayed at the bottom of the About page.</p>
                    <div style={{ background: "rgba(0,0,0,0.2)", padding: "1rem", borderRadius: "8px", borderLeft: "4px solid #22c55e" }}>
                        <p>CodeStorm is the official technical club focused on programming, problem-solving, and modern software development...</p>
                    </div>
                    <p style={{ fontSize: "0.8rem", marginTop: "1rem", fontStyle: "italic" }}>Note: To edit this text, please contact the developer or update the source code.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminAbout;
