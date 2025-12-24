import { createContext, useContext, useState, useEffect } from "react";
import API from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // STATE
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // RESTORE SESSION ON PAGE REFRESH
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);

        // ✅ Normalize _id (VERY IMPORTANT)
        setUser({
          ...parsedUser,
          _id: parsedUser._id || parsedUser.id,
        });

        setToken(storedToken);
      }
    } catch (err) {
      console.error("Auth restore failed:", err);
      localStorage.clear();
    }
  }, []);

  // LOGIN (EMAIL + PASSWORD)
  const login = async (email, password) => {
    setLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password });

      const { token, user } = res.data;

      if (!token || !user) {
        throw new Error("Invalid login response");
      }

      // ✅ Normalize user id
      const normalizedUser = {
        ...user,
        _id: user._id || user.id,
      };

      setUser(normalizedUser);
      setToken(token);

      localStorage.setItem("user", JSON.stringify(normalizedUser));
      localStorage.setItem("token", token);

      return { success: true };
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Unable to login. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  // REGISTER
  const register = async (name, email, password) => {
    setLoading(true);

    try {
      await API.post("/auth/register", { name, email, password });
      return { success: true };
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Registration failed. Try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // HELPERS
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
