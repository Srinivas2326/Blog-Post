import { useEffect, useState } from "react";
import  API  from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

export default function AdminUsers() {
  const { token, user: loggedInUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

    //  FETCH ALL USERS
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(res.data);
      } catch (err) {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

    //  DELETE USER
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await API.delete(`/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove user from UI
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

    //  UI STATES
  if (loading) {
    return (
      <div className="page-container">
        <p className="muted">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <p className="auth-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="card">
        <h2>Manage Users</h2>
        <p className="muted">Admin can delete any user account</p>

        <div style={{ overflowX: "auto", marginTop: "20px" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "999px",
                        fontSize: "0.8rem",
                        background:
                          u.role === "admin"
                            ? "rgba(124,58,237,0.2)"
                            : "rgba(34,197,94,0.2)",
                        color:
                          u.role === "admin"
                            ? "var(--accent)"
                            : "var(--success)",
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    {u._id !== loggedInUser?._id ? (
                      <button
                        className="btn-danger"
                        onClick={() => handleDelete(u._id)}
                      >
                        Delete
                      </button>
                    ) : (
                      <span className="muted">You</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <p className="muted" style={{ marginTop: "15px" }}>
              No users found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
