// frontend/src/utils/api.js
import axios from "axios";

// Vite environment variable style: VITE_API_URL
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const API = axios.create({
  baseURL: API_BASE,
  withCredentials: true,  // required for cookies + refresh tokens
});

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
