import { useEffect, useState } from "react";
import API  from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

export default function Dashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/posts");
        const filtered = res.data.filter(
          (post) => post?.author?._id === user?._id
        );
        setPosts(filtered);
      } catch (e) {}
    };
    load();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await API.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("Cannot delete");
    }
  };

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Welcome back, {user?.name}</p>
        </div>

        <Link to="/create-post" className="btn btn-primary">
          + New Post
        </Link>
      </div>

      <div className="card">
        <h3>Your Posts</h3>

        {posts.length === 0 ? (
          <p className="muted">No posts yet.</p>
        ) : (
          <ul className="post-list">
            {posts.map((post) => (
              <li key={post._id}>
                <PostCard post={post} />
                <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
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
