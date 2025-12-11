import { createContext, useContext, useState } from "react";
import { API } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("blog_user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("blog_token"));
  const [loading, setLoading] = useState(false);

  /* ---------------------------------------------------
     LOGIN
  --------------------------------------------------- */
  const login = async (email, password) => {
    setLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password });

      const { accessToken, user } = res.data;

      // Normalize ID (_id always exists)
      const fixedUser = {
        ...user,
        _id: user._id || user.id,
      };

      // Save state
      setUser(fixedUser);
      setToken(accessToken);

      // Save to localStorage
      localStorage.setItem("blog_user", JSON.stringify(fixedUser));
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

  /* ---------------------------------------------------
     REGISTER
  --------------------------------------------------- */
  const register = async (name, email, password) => {
    setLoading(true);

    try {
      const res = await API.post("/auth/register", { name, email, password });

      const { accessToken, user } = res.data;

      if (accessToken && user) {
        const fixedUser = {
          ...user,
          _id: user._id || user.id,
        };

        setUser(fixedUser);
        setToken(accessToken);

        localStorage.setItem("blog_user", JSON.stringify(fixedUser));
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

  /* ---------------------------------------------------
     LOGOUT
  --------------------------------------------------- */
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
