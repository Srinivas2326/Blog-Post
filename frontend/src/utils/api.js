import axios from "axios";

// Base URL from .env (recommended) or fallback
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://your-backend-url.onrender.com/api"; // fallback if env missing

export const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // needed for refreshToken cookie
});

// -------------------------------------------
// Attach ACCESS TOKEN to every request
// -------------------------------------------
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("blog_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -------------------------------------------
// ⭐ GOOGLE LOGIN API CALL
// -------------------------------------------
export const googleLogin = async (profile) => {
  const { email, name, googleId } = profile;

  return await API.post("/auth/google", {
    email,
    name,
    googleId,
  });
};

export default API;
