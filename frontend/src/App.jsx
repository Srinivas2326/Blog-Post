import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import PostDetails from "./pages/PostDetails";
import AllPosts from "./pages/AllPosts";   

import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="app-root">
      <Navbar />

      <main className="main-content">
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* PUBLIC BLOG LIST PAGE */}
          <Route path="/posts" element={<AllPosts />} />   

          {/* PROTECTED ROUTES */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/edit-post/:id" element={<EditPost />} />
            <Route path="/post/:id" element={<PostDetails />} /> 
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
