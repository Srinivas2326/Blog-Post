import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";

// Firebase
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // EMAIL + PASSWORD LOGIN
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
    setGoogleLoading(true);

    try {
      // Firebase popup
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;

      // Send Google data to backend
      const res = await API.post("/auth/google", {
        name: googleUser.displayName,
        email: googleUser.email,
        googleId: googleUser.uid,
      });

      //  BACKEND RETURNS { token, user }
      const { token, user } = res.data;

      //  Store EXACT keys used by AuthContext
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      // Redirect
      navigate("/dashboard");
    } catch (err) {
      console.error("GOOGLE LOGIN ERROR:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Google login failed"
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome back 👋</h2>
        <p className="auth-subtitle">
          Login to continue to your dashboard.
        </p>

        {error && <div className="auth-error">{error}</div>}

        {/* EMAIL LOGIN */}
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

          <button
            className="btn btn-primary full-width"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            margin: "15px 0",
            color: "#888",
          }}
        >
          — or —
        </div>

        {/* GOOGLE LOGIN */}
        <button
          type="button"
          className="btn btn-outline full-width"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
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
          {googleLoading ? "Connecting..." : "Continue with Google"}
        </button>

        <div className="auth-links">
          <Link to="/forgot-password">Forgot password?</Link>
          <span>
            Don’t have an account?{" "}
            <Link to="/register">Register</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
