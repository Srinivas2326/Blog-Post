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
      <Link to="/all-posts" className="nav-logo">BlogPost</Link>

      <div className="nav-right">

        <Link to="/all-posts" className="nav-link">All Posts</Link>

        {isAuthenticated ? (
          <>
            <span className="nav-link">Hi, {user?.name}</span>
            <Link to={`/user/${user?._id}`} className="nav-link">Profile</Link>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>

            <button onClick={handleLogout} className="btn btn-outline">
              Logout
            </button>
          </>
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
