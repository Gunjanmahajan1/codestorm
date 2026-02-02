import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminEvents from "./pages/AdminEvents";
import StudentEvents from "./pages/StudentEvents";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Connect from "./pages/Connect";
import AdminConnect from "./pages/AdminConnect";
import AdminDiscussion from "./pages/AdminDiscussion";
import Discussion from "./pages/Discussion";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminContests from "./pages/AdminContests";
import Contests from "./pages/Contests";
import { Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* PUBLIC ROUTES */}
<Route path="/" element={<Navigate to="/events" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/events" element={<StudentEvents />} />
        <Route path="/about" element={<About />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/contests" element={<Contests />} />

        {/* ADMIN ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/events"
          element={
            <ProtectedRoute>
              <AdminEvents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/connect"
          element={
            <ProtectedRoute>
              <AdminConnect />
            </ProtectedRoute>
          }
        />

        <Route
  path="/admin/discussion"
  element={
    <ProtectedRoute>
      <AdminDiscussion />
    </ProtectedRoute>
  }
/>

      <Route
  path="/discussion"
  element={
    <ProtectedRoute>
      <Discussion />
    </ProtectedRoute>
  }
/>

<Route path="/signup" element={<Signup />} />

<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />

<Route path="/contests" element={<Contests />} />

<Route
  path="/admin/contests"
  element={
    <ProtectedRoute>
      <AdminContests />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
