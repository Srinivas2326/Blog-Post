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
      <div className="nav-left">
        <Link to="/all-posts" className="nav-logo">
          BlogPost
        </Link>
      </div>

      <div className="nav-right">
        {isAuthenticated ? (
          <>
            <span className="nav-user">Hi, {user?.name}</span>

            <Link to="/all-posts" className="nav-link">
              All Posts
            </Link>

            {/* IMPORTANT FIX: user.id instead of user._id */}
            <Link to={`/user/${user?.id}`} className="nav-link">
              Profile
            </Link>

            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>

            <button className="btn btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/all-posts" className="nav-link">
              All Posts
            </Link>

            <Link to="/login" className="nav-link">
              Login
            </Link>

            <Link to="/register" className="btn btn-primary">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
