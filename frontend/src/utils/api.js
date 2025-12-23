import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// 🔐 Attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ✅ FIXED KEY
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
