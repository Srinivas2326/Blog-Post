import axios from "axios";

// Base API URL (Vite env variable)
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create Axios instance
const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
