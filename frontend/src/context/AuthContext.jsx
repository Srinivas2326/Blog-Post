import { createContext, useContext, useState, useEffect } from "react";
import API from "../utils/api"
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const [loading, setLoading] = useState(false);

  // ===============================
  // RESTORE SESSION
  // ===============================
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedToken) setToken(storedToken);
    } catch (err) {
      console.error("Error restoring auth state:", err);
    }
  }, []);

  // ===============================
  // LOGIN (EMAIL + PASSWORD)
  // ===============================
  const login = async (email, password) => {
    setLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password });

      const { token, user: userData } = res.data;

      if (!token || !userData) {
        throw new Error("Invalid login response");
      }

      setUser(userData);
      setToken(token);

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);

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

  // ===============================
  // REGISTER
  // ===============================
  const register = async (name, email, password) => {
    setLoading(true);

    try {
      await API.post("/auth/register", { name, email, password });
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

  // ===============================
  // LOGOUT
  // ===============================
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    API.post("/auth/logout").catch(() => {});
  };

  // ===============================
  // HELPERS
  // ===============================
  const isAuthenticated = Boolean(token);
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        setUser,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
