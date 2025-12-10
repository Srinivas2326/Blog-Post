import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API } from "../utils/api";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await API.post(`/auth/reset-password/${token}`, {
        password,
      });
      setMessage(res.data.message || "Password reset successful");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired link");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Set a new password</h2>

        {message && (
          <div className="auth-success">
            {message} <br />
            <Link to="/login">Go to login</Link>
          </div>
        )}
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label>New password</label>
            <input
              type="password"
              value={password}
              placeholder="New password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary full-width" type="submit">
            Reset password
          </button>
        </form>
      </div>
    </div>
  );
}
