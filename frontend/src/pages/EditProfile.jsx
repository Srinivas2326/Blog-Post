import { useState, useEffect } from "react";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function EditProfile() {
  const { user, setUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // SYNC USER DATA
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // UPDATE PROFILE
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await API.put("/users/me", { name, email });

      if (!res.data?.user) {
        throw new Error("Invalid server response");
      }

      //  Normalize updated user
      const updatedUser = {
        ...res.data.user,
        _id: res.data.user._id || res.data.user.id,
      };

      // Update context + localStorage (SINGLE SOURCE)
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Update failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // CHANGE PASSWORD
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!oldPassword || !newPassword) {
      return setMessage({
        type: "error",
        text: "Both old and new passwords are required.",
      });
    }

    try {
      const res = await API.put("/users/change-password", {
        currentPassword: oldPassword,
        newPassword,
      });

      setMessage({
        type: "success",
        text: res.data?.message || "Password changed successfully.",
      });

      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Password change failed.",
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
              color:
                message.type === "success"
                  ? "var(--success)"
                  : "var(--danger)",
              marginBottom: "12px",
              fontWeight: 500,
            }}
          >
            {message.text}
          </p>
        )}

        {/* UPDATE PROFILE FORM */}
        <form onSubmit={handleUpdateProfile} style={{ marginBottom: "24px" }}>
          <label>Name</label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label style={{ marginTop: "12px" }}>Email</label>
          <input
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </form>

        <hr />

        {/* CHANGE PASSWORD */}
        <h3 style={{ marginTop: "20px" }}>Change Password</h3>

        <form onSubmit={handleChangePassword}>
          <label>Old Password</label>
          <input
            type="password"
            className="input"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <label style={{ marginTop: "12px" }}>New Password</label>
          <input
            type="password"
            className="input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button className="btn btn-primary" type="submit">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
