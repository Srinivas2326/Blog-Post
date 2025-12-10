import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function PostDetails() {
  const { id } = useParams();
  const { user, token } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await API.get(`/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <p style={{ padding: "20px" }}>Loading...</p>;
  if (!post) return <p style={{ padding: "20px" }}>Post not found.</p>;

  const isAuthor =
    user && post.author && post.author._id === user._id;

  // DELETE POST
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await API.delete(`/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/dashboard");
    } catch (err) {
      alert("You cannot delete this post");
    }
  };

  return (
    <div className="page-container">
      <div className="card">

        {/* Title */}
        <h1>{post.title}</h1>

        {/* Post Meta */}
        <p className="muted" style={{ marginBottom: "15px" }}>
          By <strong>{post.author?.name}</strong> •{" "}
          {new Date(post.createdAt).toLocaleDateString()} • 👁 {post.viewCount}
        </p>

        {/* Post Content */}
        <p style={{ marginTop: "20px", lineHeight: "1.7", whiteSpace: "pre-line" }}>
          {post.content}
        </p>

        {/* Author Controls */}
        {isAuthor && (
          <div style={{ marginTop: "25px", display: "flex", gap: "12px" }}>
            <Link className="btn btn-outline" to={`/edit-post/${id}`}>
              Edit
            </Link>

            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
