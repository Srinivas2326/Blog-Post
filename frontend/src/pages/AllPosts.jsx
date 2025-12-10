import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../utils/api";

export default function AllPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await API.get("/posts");
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts", err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="page-container">
      <h1>Latest Blogs</h1>
      <p className="muted">Explore blogs from all users</p>

      <div className="card" style={{ marginTop: "20px" }}>
        {posts.length === 0 ? (
          <p className="muted">No posts available.</p>
        ) : (
          <ul className="post-list">
            {posts.map((post) => (
              <li key={post._id} className="post-item">
                <h2>{post.title}</h2>

                <p className="muted">
                  By {post.author?.name} •{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <p className="muted">Views: {post.viewCount}</p>

                <p style={{ marginTop: "10px" }}>
                  {post.content?.slice(0, 200)}...
                </p>

                <Link to={`/post/${post._id}`} className="btn btn-outline" style={{ marginTop: "12px" }}>
                  Read More →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
