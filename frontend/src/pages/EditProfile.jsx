import { useState, useEffect } from "react";
import  API  from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function EditProfile() {
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sync form values when user context updates
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

        // UPDATE PROFILE  (PUT /users/me)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await API.put("/users/me", { name, email });

      // Validate response
      if (!res.data || !res.data.user) {
        throw new Error("Invalid server response");
      }

      const updatedUser = res.data.user;

      // Update context + localStorage
      setUser(updatedUser);
      localStorage.setItem("blog_user", JSON.stringify(updatedUser));

      setMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Update failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

        // CHANGE PASSWORD  (PUT /users/change-password)
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!oldPassword || !newPassword) {
      return setMessage({
        type: "error",
        text: "Both fields are required.",
      });
    }

    try {
      const res = await API.put("/users/change-password", {
        currentPassword: oldPassword,
        newPassword: newPassword,
      });

      setMessage({
        type: "success",
        text: res.data.message || "Password changed successfully.",
      });

      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Password change failed.",
      });
    }
  };

  return (
    <div className="page-container">
      <div className="card" style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h2>Edit Profile</h2>

        {/* STATUS MESSAGE */}
        {message && (
          <p
            style={{
              color: message.type === "success" ? "var(--success)" : "var(--danger)",
              marginBottom: "10px",
              fontWeight: 500,
            }}
          >
            {message.text}
          </p>
        )}

        {/* UPDATE PROFILE FORM */}
        <form onSubmit={handleUpdateProfile} style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "6px" }}>Name</label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label style={{ display: "block", margin: "12px 0 6px" }}>Email</label>
          <input
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </form>

        <hr />

        {/* CHANGE PASSWORD */}
        <h3 style={{ marginTop: "20px" }}>Change Password</h3>

        <form onSubmit={handleChangePassword}>
          <label style={{ display: "block", marginBottom: "6px" }}>
            Old Password
          </label>
          <input
            type="password"
            className="input"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <label style={{ display: "block", margin: "12px 0 6px" }}>
            New Password
          </label>
          <input
            type="password"
            className="input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
