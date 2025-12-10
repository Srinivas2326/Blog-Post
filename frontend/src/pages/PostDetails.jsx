import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function PostDetails() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await API.get(`/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setPost(res.data);
      } catch (err) {
        console.log("Error fetching post:", err);
      }
    };

    fetchPost();
  }, [id, token]);

  if (!post) return <p>Loading...</p>;

  const isAuthor =
    user && post.author && post.author._id === user._id;

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
        <h1>{post.title}</h1>

        <p className="muted">
          By <strong>{post.author?.name}</strong> •{" "}
          {new Date(post.createdAt).toLocaleDateString()}
        </p>

        <p style={{ marginTop: "20px", lineHeight: "1.7" }}>
          {post.content}
        </p>

        {isAuthor && (
          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
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
