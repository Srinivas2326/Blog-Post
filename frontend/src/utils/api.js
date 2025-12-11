// src/utils/api.js
import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically attach token
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
