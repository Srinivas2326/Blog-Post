import axios from "axios";

export const API = axios.create({
  baseURL: "https://blog-post-5elh.onrender.com/api",
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
