import { useEffect, useState } from "react";
import { API } from "../utils/api";
import PostCard from "../components/PostCard";

export default function AllPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/posts");
        setPosts(res.data);
      } catch (e) {
        console.log("Error loading posts", e);
      }
    };
    load();
  }, []);

  return (
    <div className="page-container">
      <h1>Latest Blogs</h1>
      <p className="muted">Explore blogs from all users</p>

      <ul className="post-list">
        {posts.map((p) => (
          <li key={p._id}>
            <PostCard post={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}
