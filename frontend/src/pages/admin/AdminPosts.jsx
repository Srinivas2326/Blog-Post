import { useEffect, useState } from "react";
import { API } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminPosts() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ======================================================
     FETCH ALL POSTS (ADMIN)
  ====================================================== */
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await API.get("/admin/posts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPosts(res.data);
      } catch (err) {
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [token]);

  /* ======================================================
     DELETE POST
  ====================================================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await API.delete(`/admin/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete post");
    }
  };

  /* ======================================================
     UI STATES
  ====================================================== */
  if (loading) {
    return (
      <div className="page-container">
        <p className="muted">Loading posts...</p>
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
        <h2>Manage Posts</h2>
        <p className="muted">
          Admin can edit or delete posts from any author
        </p>

        <div style={{ overflowX: "auto", marginTop: "20px" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th>Title</th>
                <th>Author</th>
                <th>Views</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {posts.map((post) => (
                <tr
                  key={post._id}
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  <td style={{ maxWidth: "260px" }}>
                    <strong>{post.title}</strong>
                    <p className="muted" style={{ fontSize: "0.8rem" }}>
                      {post.content?.slice(0, 80)}...
                    </p>
                  </td>

                  <td>
                    {post.author?.name}
                    <br />
                    <span className="muted" style={{ fontSize: "0.8rem" }}>
                      {post.author?.email}
                    </span>
                  </td>

                  <td>{post.viewCount}</td>

                  <td>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>

                  <td style={{ display: "flex", gap: "10px" }}>
                    <button
                      className="btn-outline"
                      onClick={() => navigate(`/edit-post/${post._id}`)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(post._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {posts.length === 0 && (
            <p className="muted" style={{ marginTop: "15px" }}>
              No posts found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
