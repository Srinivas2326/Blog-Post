import { createContext, useContext, useEffect, useState } from "react";
import { API } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("blog_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("blog_token"));
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      const { accessToken, user } = res.data;

      setUser(user);
      setToken(accessToken);

      localStorage.setItem("blog_user", JSON.stringify(user));
      localStorage.setItem("blog_token", accessToken);

      return { success: true };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/register", {
        name,
        email,
        password,
      });

      // optional: auto-login after register
      const { accessToken, user } = res.data;
      if (accessToken && user) {
        setUser(user);
        setToken(accessToken);
        localStorage.setItem("blog_user", JSON.stringify(user));
        localStorage.setItem("blog_token", accessToken);
      }

      return { success: true };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("blog_user");
    localStorage.removeItem("blog_token");
  };

  const value = {
    user,
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
