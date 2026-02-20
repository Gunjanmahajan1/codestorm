# CodeStorm — Official College Coding Club Website 🚀

> **Live Production Project** — This is the official website for the CodeStorm college coding club, currently deployed and actively used by students and admins.

---

## 📌 What is CodeStorm?

CodeStorm is a full-stack web platform built for a college coding club. It provides:

- 📅 **Events & Contests** – Admins post events and contests; students browse them
- 🏆 **About / Core Committee** – Club intro, image sliders, and member grid
- 💬 **Discussion Room** – A real-time-like chat room for all club members
- 🔒 **Role-Based Access** – Separate views and controls for `admin` and `student` roles
- 🔔 **Browser Notifications** – Push alerts for new discussion messages
- 🔑 **Auth System** – Signup, Login, Forgot Password (OTP via email), Reset Password

---

## 🛠 Tech Stack Overview

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, React Router v7, Framer Motion, Axios |
| **Backend** | Node.js, Express.js, MongoDB (Mongoose) |
| **Auth** | JWT + bcryptjs |
| **Storage** | Cloudinary (images) |
| **Email** | Nodemailer (OTP for password reset) |
| **Real-time** | Socket.IO + polling |
| **Bulk Uploads** | XLSX (Excel/CSV contest import) |

---

## 📂 Repository Structure

```
codestrom/                  ← Root (monorepo)
├── backend/                ← Express + MongoDB API server
│   └── README.md           ← Backend-specific documentation
├── frontend/               ← React + Vite SPA
│   └── README.md           ← Frontend-specific documentation
├── package.json            ← Root scripts (runs both together)
└── README.md               ← You are here
```

---

## ⚡ Quick Start — Run Everything Locally

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9
- MongoDB Atlas cluster (or local MongoDB)
- Cloudinary account

### 1. Clone the repo
```bash
git clone https://github.com/<your-org>/codestrom.git
cd codestrom
```

### 2. Set up environment variables
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env and fill in all values

# Frontend
# Create frontend/.env and add:
# VITE_API_URL=http://localhost:5000
```

### 3. Install all dependencies
```bash
# Root
npm install

# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..
```

### 4. Run both servers concurrently
```bash
npm run dev
```

This launches:
- 🟢 **Backend** → `http://localhost:5000`
- 🔵 **Frontend** → `http://localhost:5173`

---

## 👥 User Roles

| Feature | Student | Admin |
|---|---|---|
| View Events, About, Contests, Contact | ✅ | ✅ |
| Join Discussion Room | ✅ | ✅ |
| Edit / Delete own messages | ✅ | ✅ |
| Delete any message | ❌ | ✅ |
| Manage Events, Contests, About, Contact | ❌ | ✅ |
| Upload images / media | ❌ | ✅ |
| Toggle discussion room access | ❌ | ✅ |
| Bulk upload contests via Excel | ❌ | ✅ |

---

## � Detailed Documentation

| Readme | Contents |
|---|---|
| [`backend/README.md`](./backend/README.md) | API routes, models, middleware, env vars, backend setup |
| [`frontend/README.md`](./frontend/README.md) | Pages, components, routing, frontend env vars, build & deploy |

---

## ☁️ Deployment

| Service | Platform |
|---|---|
| Backend API | Render Web Service |
| Frontend SPA | Render Static Site (or Vercel / Netlify) |
| Database | MongoDB Atlas |
| Image Storage | Cloudinary |

See the sub-READMEs for detailed deployment instructions.

---

## 🤝 Contributing

This is an internal CodeStorm club project.

1. Branch off `main`: `git checkout -b feature/your-feature`
2. Commit with a clear message
3. Open a Pull Request — the core team reviews before merging
4. ⚠️ **Never commit `.env` files**

---

<p align="center">Made with ❤️ by the CodeStorm Club Team</p>
