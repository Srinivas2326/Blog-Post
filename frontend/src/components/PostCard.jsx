import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  const date = new Date(post.createdAt).toLocaleDateString();

  return (
    <div className="post-item">
      <h3>{post.title}</h3>

      <p className="muted" style={{ marginTop: "4px" }}>
        By {post.author?.name} • {date}
      </p>

      <p style={{ marginTop: "12px", color: "var(--muted)" }}>
        {post.content.slice(0, 150)}...
      </p>

      <Link to={`/post/${post._id}`} className="btn btn-outline" style={{ marginTop: "14px" }}>
        Read More →
      </Link>
    </div>
  );
}
