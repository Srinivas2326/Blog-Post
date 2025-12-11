import { useState } from "react";
import { API } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put("/users/me", { name, email });

      setUser(res.data.user);
      localStorage.setItem("blog_user", JSON.stringify(res.data.user));

      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage("Update failed.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await API.put("/users/change-password", {
        oldPassword,
        newPassword,
      });

      setMessage("Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Password change failed.");
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2>Edit Profile</h2>

        {message && <p style={{ color: "lightgreen" }}>{message}</p>}

        {/* UPDATE PROFILE FORM */}
        <form onSubmit={handleUpdateProfile}>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />

          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />

          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </form>

        <hr style={{ margin: "20px 0" }} />

        {/* CHANGE PASSWORD FORM */}
        <h3>Change Password</h3>
        <form onSubmit={handleChangePassword}>
          <label>Old Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button type="submit" className="btn btn-primary">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
