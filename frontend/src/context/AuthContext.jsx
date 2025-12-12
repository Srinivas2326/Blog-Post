// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { API } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  /* ------------------------------------
        USER + TOKEN INITIAL STATE
  --------------------------------------*/
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("blog_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("blog_token") || null;
  });

  const [loading, setLoading] = useState(false);

  /* ------------------------------------
        RESTORE SESSION ON REFRESH
  --------------------------------------*/
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("blog_user");
      const storedToken = localStorage.getItem("blog_token");

      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedToken) setToken(storedToken);
    } catch (err) {
      console.error("Error restoring auth state:", err);
    }
  }, []);

  /* ------------------------------------
                LOGIN
  --------------------------------------*/
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });

      const { accessToken, user: userData } = res.data;

      if (!accessToken || !userData) {
        return { success: false, message: "Invalid server response" };
      }

      // Ensure user has _id property
      const fixedUser = { ...userData, _id: userData._id || userData.id };

      setUser(fixedUser);
      setToken(accessToken);

      // Persist
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

  /* ------------------------------------
                REGISTER
  --------------------------------------*/
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/register", { name, email, password });

      const { accessToken, user: userData } = res.data || {};

      if (accessToken && userData) {
        const fixedUser = { ...userData, _id: userData._id || userData.id };

        setUser(fixedUser);
        setToken(accessToken);

        localStorage.setItem("blog_user", JSON.stringify(fixedUser));
        localStorage.setItem("blog_token", accessToken);

        return { success: true };
      }

      return {
        success: false,
        message: "Invalid response from server",
      };
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

  /* ------------------------------------
                LOGOUT
  --------------------------------------*/
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("blog_user");
    localStorage.removeItem("blog_token");
    localStorage.removeItem("blog_userId");

    // call backend logout (ignore failures)
    API.post("/auth/logout").catch(() => {});
  };

  /* ------------------------------------
                EXPORT CONTEXT
  --------------------------------------*/
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        setUser,           // <-- IMPORTANT: needed for EditProfile updates
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
