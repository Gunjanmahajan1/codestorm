# CodeStorm — Frontend 🎨

> React 19 + Vite single-page application for the CodeStorm College Coding Club Website.  
> Deployed on **Render Static Site** (or Vercel / Netlify) and connected to the live backend API.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Pages & Routing](#-pages--routing)
- [Components](#-components)
- [API Service](#-api-service)
- [Environment Variables](#-environment-variables)
- [Local Development](#-local-development)
- [Building for Production](#-building-for-production)
- [Deployment](#-deployment)
- [Styling System](#-styling-system)

---

## 🛠 Tech Stack

| Package | Purpose |
|---|---|
| **React 19** | UI library |
| **Vite 7** | Build tool & dev server (HMR) |
| **React Router DOM v7** | Client-side routing |
| **Axios** | HTTP requests (centralised API service) |
| **Framer Motion** | Page/component animations |
| **React Icons** | Scalable SVG icon set |
| **Socket.IO Client** | WebSocket (real-time ready) |
| **Vanilla CSS** | Custom design system (no Tailwind) |
| **ESLint** | Code linting |

---

## 📂 Project Structure

```
frontend/
├── public/
│   └── favicon.ico
│
├── src/
│   ├── assets/
│   │   └── codestorm_logo.png
│   │
│   ├── components/             # Shared / reusable UI
│   │   └── Navbar.jsx          # Navigation bar (public + admin dropdown)
│   │
│   ├── pages/                  # One file per route
│   │   │
│   │   ├── ── PUBLIC / STUDENT ──
│   │   ├── LandingPage.jsx     # Home: Events + About + Connect sections
│   │   ├── StudentEvents.jsx   # Events listing with image slider
│   │   ├── About.jsx           # About page: slider + core committee grid
│   │   ├── Contests.jsx        # Contests listing
│   │   ├── Discussion.jsx      # Student discussion room (chat UI)
│   │   ├── Connect.jsx         # Social links + contact info
│   │   │
│   │   ├── ── AUTH ──
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── ForgotPassword.jsx  # Email submission + OTP entry
│   │   ├── ResetPassword.jsx   # New password form
│   │   │
│   │   └── ── ADMIN ──
│   │       ├── Dashboard.jsx       # Admin home
│   │       ├── AdminEvents.jsx     # Create/edit/delete events + image upload
│   │       ├── AdminAbout.jsx      # Manage slider images + core-committee
│   │       ├── AdminContests.jsx   # Add/remove contests + bulk Excel upload
│   │       ├── AdminConnect.jsx    # Edit contact & social links
│   │       └── AdminDiscussion.jsx # Moderate discussion room
│   │
│   ├── services/
│   │   └── api.js              # Centralised Axios instance (JWT interceptor)
│   │
│   ├── styles/                 # CSS files (scoped per section)
│   │   ├── dashboard.css
│   │   ├── login.css
│   │   └── ...
│   │
│   ├── App.jsx                 # Root component with all <Route> definitions
│   ├── main.jsx                # React DOM entry point
│   └── index.css               # Global styles / CSS variables
│
├── index.html                  # Vite HTML template
├── vite.config.js
├── eslint.config.js
└── package.json
```

---

## 🗺 Pages & Routing

| Path | Component | Access |
|---|---|---|
| `/` | `LandingPage` → Events + About + Connect | Public |
| `/#events` | Scrolls to Events section | Public |
| `/#about` | Scrolls to About section | Public |
| `/#contact` | Scrolls to Connect section | Public |
| `/contests` | `Contests` | Auth (student + admin) |
| `/discussion` | `Discussion` | Auth (student only) |
| `/login` | `Login` | Public |
| `/signup` | `Signup` | Public |
| `/forgot-password` | `ForgotPassword` | Public |
| `/reset-password` | `ResetPassword` | Public |
| `/dashboard` | `Dashboard` | Admin only |
| `/admin/events` | `AdminEvents` | Admin only |
| `/admin/about` | `AdminAbout` | Admin only |
| `/admin/contests` | `AdminContests` | Admin only |
| `/admin/connect` | `AdminConnect` | Admin only |
| `/admin/discussion` | `AdminDiscussion` | Admin only |

---

## 🧩 Components

### `Navbar.jsx`
- **Logo** with club branding
- **Public links**: Events, About, Contact, Contests, Discussion
- **Admin dropdown**: Dashboard, Events, Contact, About, Contests, Discussion
- **Auth**: Login link (guest) / Logout button (authenticated)
- **Mobile responsive**: Hamburger menu toggle
- **Global notifications**: Polls `/api/discussion` every **10 s** and fires a browser push notification when a new message arrives (while the user is on another page)

---

## 🔌 API Service

All API calls go through a single Axios instance defined in `src/services/api.js`:


## 🔒 Environment Variables

Create a `frontend/.env` file (not committed to git):

```env
# URL of the backend API
VITE_API_URL=https://your-backend.onrender.com
```

| Variable | Local Value | Production Value |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5000` | `https://your-backend.onrender.com` |

> If `VITE_API_URL` is not set, the app falls back to `http://localhost:5000` automatically.

---

## 💻 Local Development

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173` with **Hot Module Replacement (HMR)** enabled.

Make sure the backend is running on port `5000` (or update `VITE_API_URL`).

---

## 🏗 Building for Production

```bash
cd frontend
npm run build
```

Output is placed in `frontend/dist/`.  
Preview the production build locally:

```bash
npm run preview
```

---

## ☁️ Deployment

### Render Static Site

| Setting | Value |
|---|---|
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |
| **Environment Variable** | `VITE_API_URL` = your backend URL |

### Vercel / Netlify

1. Connect the repo
2. Set **Base Directory** to `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add `VITE_API_URL` as an environment variable

> ⚠️ For React Router to work on Netlify, add a `frontend/public/_redirects` file:
> ```
> /*  /index.html  200
> ```

---

## 🎨 Styling System

- All styles use **Vanilla CSS** with custom properties (CSS variables)
- Global tokens and resets are in `src/index.css`
- Per-feature styles live in `src/styles/` (e.g., `dashboard.css`, `login.css`)
- The design uses a dark theme with green (`#22c55e`) as the primary accent colour
- Animations are handled by **Framer Motion** for page transitions and component reveals

---

← Back to [Main README](../README.md)
