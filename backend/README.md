# CodeStorm — Backend API 🛠

> Express + MongoDB REST API for the CodeStorm College Coding Club Website.  
> Deployed on **Render** and serving the live production frontend.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Database Models](#-database-models)
- [Authentication & Authorization](#-authentication--authorization)
- [Environment Variables](#-environment-variables)
- [Local Development](#-local-development)
- [Deployment](#-deployment)

---

## 🛠 Tech Stack

| Package | Purpose |
|---|---|
| **express** | HTTP server & routing |
| **mongoose** | MongoDB ODM |
| **jsonwebtoken** | JWT auth tokens |
| **bcryptjs** | Password hashing |
| **multer** | Multipart file upload handling |
| **cloudinary** + **multer-storage-cloudinary** | Cloud image storage |
| **nodemailer** | Email sending (OTP password reset) |
| **socket.io** | WebSocket support (real-time ready) |
| **xlsx** | Excel/CSV parsing for bulk contest imports |
| **morgan** | HTTP request logging (dev mode) |
| **cors** | Cross-origin resource sharing |
| **dotenv** | Environment variable loading |
| **nodemon** | Auto-restart in development |

---

## 📂 Project Structure

```
backend/
├── src/
│   ├── server.js               # Entry point — connects MongoDB, starts server
│   ├── app.js                  # Express app — middleware, routes, CORS, error handler
│   │
│   ├── models/                 # Mongoose schemas / data models
│   │   ├── User.model.js
│   │   ├── Event.model.js
│   │   ├── EventSlider.model.js
│   │   ├── Contest.model.js
│   │   ├── Discussion.model.js
│   │   ├── DiscussionSetting.model.js
│   │   ├── Media.model.js
│   │   ├── CoreTeam.model.js
│   │   ├── AboutSlider.model.js
│   │   ├── AboutContent.model.js
│   │   ├── Contact.model.js
│   │   └── Social.model.js
│   │
│   ├── controllers/            # Route handler logic (one file per resource)
│   │
│   ├── routes/                 # Express route definitions
│   │   ├── auth.routes.js
│   │   ├── event.routes.js
│   │   ├── eventSlider.routes.js
│   │   ├── contest.routes.js
│   │   ├── externalContest.routes.js
│   │   ├── discussion.routes.js
│   │   ├── media.routes.js
│   │   ├── coreTeam.routes.js
│   │   ├── aboutSlider.routes.js
│   │   ├── aboutContent.routes.js
│   │   ├── contact.routes.js
│   │   └── social.routes.js
│   │
│   └── middleware/
│       ├── auth.middleware.js    # JWT verification, role guard
│       └── error.middleware.js   # Global error handler
│
├── uploads/                    # Local file storage (development only)
├── scripts/                    # Utility / seed scripts
├── .env.example                # Environment variable template
├── .env                        # ⚠️ NOT committed — create from .env.example
└── package.json
```

---

## 🔌 API Endpoints

Base URL (production): `https://your-backend.onrender.com`  
All routes are prefixed with `/api`.

### Auth — `/api/auth`
| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | Public | Register a new student account |
| `POST` | `/login` | Public | Login — returns JWT token |
| `POST` | `/forgot-password` | Public | Send OTP to registered email |
| `POST` | `/reset-password` | Public | Verify OTP and reset password |

### Events — `/api/events`
| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Public | Get all events |
| `POST` | `/` | Admin | Create a new event |
| `PUT` | `/:id` | Admin | Update an event |
| `DELETE` | `/:id` | Admin | Delete an event |

### Events Slider — `/api/events-slider`
| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Public | Get all events slider images |
| `POST` | `/` | Admin | Upload a slider image |
| `DELETE` | `/:id` | Admin | Remove a slider image |

### Contests — `/api/contests`
| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Auth | Get all club contests |
| `POST` | `/` | Admin | Add a contest |
| `DELETE` | `/:id` | Admin | Delete a contest |

### External Contests — `/api/external-contests`
| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Auth | Get all external contests |
| `POST` | `/` | Admin | Add an external contest |
| `DELETE` | `/:id` | Admin | Delete an external contest |

### Discussion — `/api/discussion`
| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Auth | Get all messages (respects discussion setting) |
| `POST` | `/` | Auth | Post a message (text and/or image) |
| `PUT` | `/:id` | Auth (owner) | Edit own message text |
| `DELETE` | `/:id` | Auth (owner / admin) | Delete a message |

### Core Team — `/api/core-team`
| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Public | Get all core-committee members |
| `POST` | `/` | Admin | Add a member (with photo upload) |
| `DELETE` | `/:id` | Admin | Remove a member |

### About Slider — `/api/about-slider`
| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Public | Get all About page slider images |
| `POST` | `/` | Admin | Upload a slider image |
| `DELETE` | `/:id` | Admin | Remove a slider image |

### About Content — `/api/about-content`
| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Public | Get editable about-page text/year |
| `PUT` | `/` | Admin | Update about-page content |

### Contact — `/api/contact`
| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Public | Get contact info |
| `PUT` | `/` | Admin | Update contact info |

### Social Links — `/api/social`
| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Public | Get all social links |
| `PUT` | `/` | Admin | Update social links |

### Media — `/api/media`
| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Public | Get all media files |
| `POST` | `/` | Admin | Upload a media file |
| `DELETE` | `/:id` | Admin | Delete a media file |

---

## 🗄 Database Models

| Model | Key Fields |
|---|---|
| `User` | `name`, `email`, `phone`, `password` (hashed), `role` (admin/student), `resetPasswordToken`, `resetPasswordExpire` |
| `Event` | `title`, `description`, `date`, `images[]`, `createdAt` |
| `EventSlider` | `imageUrl`, `publicId`, `order` |
| `Contest` | `name`, `platform`, `link`, `date`, `type` (internal/external) |
| `Discussion` | `content`, `image`, `author` (ref User), `role`, `createdAt` |
| `DiscussionSetting` | `isOpen` (toggles access for students) |
| `CoreTeam` | `name`, `role`, `photo`, `year` |
| `AboutSlider` | `imageUrl`, `publicId`, `order` |
| `AboutContent` | `description`, `year`, `updatedAt` |
| `Contact` | `email`, `phone`, `address` |
| `Social` | `platform`, `url`, `icon` |
| `Media` | `url`, `publicId`, `type`, `createdAt` |

---

## 🔐 Authentication & Authorization

- All protected routes require a `Bearer <token>` header
- The frontend automatically attaches it via the Axios interceptor in `frontend/src/services/api.js`
- The `auth.middleware.js` verifies the JWT and attaches `req.user` (with `role`)
- Admin-only routes additionally check `req.user.role === 'admin'`

**Password Reset Flow:**
1. `POST /api/auth/forgot-password` → generates OTP, sends via Nodemailer
2. `POST /api/auth/reset-password` → verifies OTP, updates hashed password

---

## 🔒 Environment Variables

Copy `.env.example` → `.env` and fill in all values:

```env
# Server
PORT=5000
NODE_ENV=development          # Use 'production' on Render

# MongoDB
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/codestrom

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary (image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Nodemailer (Gmail recommended — use an App Password)
EMAIL_USER=yourclub@gmail.com
EMAIL_PASS=your_app_password

# CORS — Production frontend URL
FRONTEND_URL=https://your-frontend.onrender.com
```

> ⚠️ The `FRONTEND_URL` must be set in production or CORS will block the frontend.

---

## 💻 Local Development

```bash
cd backend
npm install
npm run dev       # nodemon auto-restarts on file changes
```

Server runs on `http://localhost:5000`.  
Health check: `GET /` → returns `{ success: true, message: "CodeStorm API is running 🚀" }`

---

## ☁️ Deployment (Render)

| Setting | Value |
|---|---|
| **Root Directory** | `backend` |
| **Build Command** | `npm install` |
| **Start Command** | `node src/server.js` |
| **Environment** | Add all `.env` variables in the Render dashboard |

> Images uploaded in production are stored on **Cloudinary**, not the local `uploads/` folder.

---

← Back to [Main README](../README.md)
