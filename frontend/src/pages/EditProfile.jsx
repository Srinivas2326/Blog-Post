import { useEffect, useState } from "react";
import { API } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const [form, setForm] = useState({
    name: "",
    email: ""
  });

  useEffect(() => {
    const fetchUser = async () => {
      const res = await API.get(`/users/profile/${userId}`);
      setForm({
        name: res.data.user.name,
        email: res.data.user.email
      });
    };
    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.put("/users/me", form);

    alert("Profile updated successfully!");
    navigate(`/user/${userId}`);
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2>Edit Profile</h2>

        <form onSubmit={handleSubmit} className="form">
          <label>Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} />

          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} />

          <button className="btn btn-primary" type="submit">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
