import { useEffect, useState } from "react";
import { API } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !user) return;

    const load = async () => {
      try {
        const res = await API.get("/posts/mine");
        setPosts(res.data);
      } catch (err) {
        console.error("Error loading posts:", err);
      }
    };

    load();
  }, [token, user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await API.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Could not delete post");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Welcome back, {user?.name}</p>
        </div>

        <Link to="/create-post" className="btn btn-primary">+ New Post</Link>
      </div>

      <div className="card">
        <h3>Your Posts</h3>

        {posts.length === 0 ? (
          <p className="muted">No posts found. Create your first post!</p>
        ) : (
          <ul className="post-list">
            {posts.map((post) => (
              <li key={post._id} className="post-item">
                <h4>{post.title}</h4>
                <p>{post.content.slice(0, 140)}...</p>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button
                    className="btn btn-outline"
                    onClick={() => navigate(`/edit-post/${post._id}`)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(post._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
