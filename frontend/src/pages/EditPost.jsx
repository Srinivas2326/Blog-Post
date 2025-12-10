import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState("");

  // Fetch existing post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await API.get(`/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm({
          title: res.data.title,
          content: res.data.content,
        });
      } catch (err) {
        setError("Failed to load post");
      }
    };

    fetchPost();
  }, [id, token]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(
        `/posts/${id}`,
        {
          title: form.title,
          content: form.content,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/dashboard");
    } catch (err) {
      setError("Failed to update post");
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2>Edit Post</h2>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label>Content</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={6}
              required
            />
          </div>

          <button className="btn btn-primary" type="submit">
            Update Post
          </button>
        </form>
      </div>
    </div>
  );
}
