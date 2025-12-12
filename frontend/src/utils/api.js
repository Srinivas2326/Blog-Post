// src/utils/api.js
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // required for refresh token cookie
});

// Attach access token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("blog_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
