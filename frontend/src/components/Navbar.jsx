import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/all-posts" className="nav-logo">
        BlogPost
      </Link>

      <div className="nav-right">
        <Link to="/all-posts" className="nav-link">All Posts</Link>

        {isAuthenticated && (
          <>
            <span className="nav-link">Hi, {user?.name}</span>
            <Link to={`/user/${user?._id}`} className="nav-link">Profile</Link>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
          </>
        )}

        {/* THEME SWITCH BUTTON */}
        <button
          className="theme-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        {isAuthenticated ? (
          <button className="btn btn-outline" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
