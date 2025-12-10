import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* LEFT SIDE LOGO */}
      <div className="nav-left">
        <Link to="/posts" className="nav-logo"> {/* 👈 Public home */}
          BlogPost
        </Link>
      </div>

      {/* RIGHT SIDE NAV LINKS */}
      <div className="nav-right">
        {isAuthenticated ? (
          <>
            {/* Greeting */}
            <span className="nav-user">Hi, {user?.name}</span>

            {/* Public posts page */}
            <Link to="/posts" className="nav-link">
              All Posts
            </Link>

            {/* Dashboard */}
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>

            {/* Logout */}
            <button className="btn btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Public posts page (for non-logged users also) */}
            <Link to="/posts" className="nav-link">
              All Posts
            </Link>

            <Link to="/login" className="nav-link">
              Login
            </Link>

            <Link to="/register" className="btn btn-primary">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
