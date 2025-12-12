// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { API } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  /* ---------------------------------------------
     STATE: USER + TOKEN + LOADING
  ---------------------------------------------- */
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("blog_user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("blog_token"));
  const [loading, setLoading] = useState(false);

  /* ---------------------------------------------
     AUTO LOAD FROM LOCAL STORAGE ON REFRESH
  ---------------------------------------------- */
  useEffect(() => {
    const storedUser = localStorage.getItem("blog_user");
    const storedToken = localStorage.getItem("blog_token");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);
  }, []);

  /* ---------------------------------------------
     🔥 OPTIONAL: AUTO LOGIN USING REFRESH TOKEN
     (Only works if backend implements /auth/refresh)
  ---------------------------------------------- */
  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const res = await API.get("/auth/refresh");
        if (res.data?.accessToken) {
          localStorage.setItem("blog_token", res.data.accessToken);
          setToken(res.data.accessToken);
        }
        if (res.data?.user) {
          setUser(res.data.user);
          localStorage.setItem("blog_user", JSON.stringify(res.data.user));
        }
      } catch (err) {
        console.log("No refresh token available");
      }
    };

    if (!token) tryRefresh();
  }, [token]);

  /* ---------------------------------------------
     LOGIN
  ---------------------------------------------- */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });

      const { accessToken, user } = res.data;

      if (!accessToken || !user) {
        return { success: false, message: "Invalid server response" };
      }

      const fixedUser = { ...user, _id: user._id || user.id };

      // Save to state
      setUser(fixedUser);
      setToken(accessToken);

      // Save to local storage
      localStorage.setItem("blog_user", JSON.stringify(fixedUser));
      localStorage.setItem("blog_token", accessToken);
      localStorage.setItem("blog_userId", fixedUser._id);

      return { success: true };

    } catch (err) {
      console.error("LOGIN ERROR:", err);

      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------
     REGISTER
  ---------------------------------------------- */
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/register", {
        name,
        email,
        password,
      });

      // Some backends return token directly after register
      const { accessToken, user } = res.data || {};

      if (accessToken && user) {
        const fixedUser = { ...user, _id: user._id || user.id };

        setUser(fixedUser);
        setToken(accessToken);

        localStorage.setItem("blog_user", JSON.stringify(fixedUser));
        localStorage.setItem("blog_token", accessToken);
      }

      return { success: true };

    } catch (err) {
      console.error("REGISTER ERROR:", err);

      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------
     LOGOUT
  ---------------------------------------------- */
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("blog_user");
    localStorage.removeItem("blog_token");
    localStorage.removeItem("blog_userId");

    // Optional: tell backend to clear refresh cookie
    try {
      API.post("/auth/logout");
    } catch {}
  };

  /* ---------------------------------------------
     CONTEXT VALUE
  ---------------------------------------------- */
  const value = {
    user,
    setUser,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
