import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import { ThemeProvider } from "./context/ThemeContext";

// Auth Pages
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

// User Pages
import Dashboard from "./pages/Dashboard.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import EditPost from "./pages/EditPost.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";

// Public Blog Pages
import AllPosts from "./pages/AllPosts.jsx";
import PostDetails from "./pages/PostDetails.jsx";
import UserProfile from "./pages/UserProfile.jsx";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminPosts from "./pages/admin/AdminPosts.jsx";

// Misc
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <div className="app-root">
        <Navbar />

        <main className="main-content">
          <Routes>
            {/* ================= PUBLIC ROUTES ================= */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route path="/all-posts" element={<AllPosts />} />
            <Route path="/post/:id" element={<PostDetails />} />
            <Route path="/user/:id" element={<UserProfile />} />

            {/* ================= USER PROTECTED ROUTES ================= */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/edit-post/:id" element={<EditPost />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/change-password" element={<ChangePassword />} />
            </Route>

            {/* ================= ADMIN ROUTES ================= */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/posts" element={<AdminPosts />} />
            </Route>

            {/* ================= 404 ================= */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}
