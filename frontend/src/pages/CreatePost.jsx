import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API  from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function CreatePost() {
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { token, user } = useAuth();

  //  BLOCK DEACTIVATED USERS AT UI LEVEL
  if (user && user.isActive === false) {
    return (
      <div className="page-container">
        <div className="card">
          <h2>Create a new post</h2>
          <p className="auth-error" style={{ marginTop: "1rem" }}>
            ❌ Your account has been deactivated by admin.
            <br />
            You cannot create new posts.
          </p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await API.post(
        "/posts",
        {
          title: form.title,
          content: form.content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2>Create a new post</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Post title"
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
              placeholder="Write your story..."
              required
            />
          </div>

          <button className="btn btn-primary" type="submit">
            Publish
          </button>
        </form>
      </div>
    </div>
  );
}
