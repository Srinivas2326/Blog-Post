import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API } from "../utils/api";

// Firebase imports
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

        // NORMAL EMAIL + PASSWORD LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login(form.email, form.password);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
  };

                // GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    setError("");

    try {
      // Google Login Popup
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;

      // Send to backend to create/login the user
      const res = await API.post("/auth/google", {
        name: googleUser.displayName,
        email: googleUser.email,
        googleId: googleUser.uid,
      });

      const { accessToken, user } = res.data;

      // Save session
      localStorage.setItem("blog_user", JSON.stringify(user));
      localStorage.setItem("blog_token", accessToken);

      navigate("/dashboard");
    } catch (err) {
      console.error("GOOGLE LOGIN ERROR:", err);
      setError(err.response?.data?.message || "Google login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome back 👋</h2>
        <p className="auth-subtitle">Login to continue to your dashboard.</p>

        {error && <div className="auth-error">{error}</div>}

        {/* ------------------ FORM ------------------ */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button className="btn btn-primary full-width" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* ------------------ OR DIVIDER ------------------ */}
        <div style={{ textAlign: "center", margin: "15px 0", color: "#888" }}>
          — or —
        </div>

        {/* ---------------- GOOGLE LOGIN BUTTON -------------- */}
        <button
          type="button"
          className="btn btn-outline full-width"
          onClick={handleGoogleLogin}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            style={{ width: "18px", height: "18px" }}
          />
          Continue with Google
        </button>

        {/* ------------------ LINKS ------------------ */}
        <div className="auth-links">
          <Link to="/forgot-password">Forgot password?</Link>
          <span>
            Don&apos;t have an account? <Link to="/register">Register</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
