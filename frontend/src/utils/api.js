import axios from "axios";

export const API = axios.create({
  baseURL: "https://blog-post-5elh.onrender.com/api",
  withCredentials: true,
});


API.interceptors.request.use((config) => {
  const token = localStorage.getItem("blog_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
