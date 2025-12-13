import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <div className="card">
        <h1>Admin Dashboard</h1>
        <p className="muted">
          Welcome back, <strong>{user?.name}</strong>
        </p>

        <hr style={{ margin: "20px 0" }} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {/* USERS */}
          <div className="card">
            <h3>Manage Users</h3>
            <p className="muted">
              View all users, delete authors, manage access.
            </p>

            <Link to="/admin/users" className="btn-primary">
              Go to Users →
            </Link>
          </div>

          {/* POSTS */}
          <div className="card">
            <h3>Manage Posts</h3>
            <p className="muted">
              Edit or delete posts from any author.
            </p>

            <Link to="/admin/posts" className="btn-primary">
              Go to Posts →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
