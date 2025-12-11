import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API } from "../utils/api";

export default function UserProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loggedInUserId = localStorage.getItem("userId");

  useEffect(() => {
    if (!id) return;

    const fetchProfile = async () => {
      try {
        const res = await API.get(`/users/profile/${id}`);
        setData(res.data);
      } catch (err) {
        console.log("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>User not found.</p>;

  const { user, posts } = data;

  return (
    <div className="page-container">
      <div className="card">

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>{user.name}</h1>

          {user._id === loggedInUserId && (
            <Link to="/edit-profile" className="btn btn-primary">
              Edit Profile
            </Link>
          )}
        </div>

        <p className="muted">{user.email}</p>
        <p className="muted">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>

        <hr style={{ margin: "20px 0" }} />

        <h3>Posts by {user.name}</h3>

        {posts.length === 0 ? (
          <p className="muted">This user has not written any posts yet.</p>
        ) : (
          <ul className="post-list">
            {posts.map((post) => (
              <li key={post._id} className="post-item">
                <h4>{post.title}</h4>
                <p>{post.content.slice(0, 120)}...</p>
                <Link className="btn btn-primary" to={`/post/${post._id}`}>
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
