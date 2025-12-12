import { createContext, useContext, useState, useEffect } from "react";
import { API } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
        // USER + TOKEN INITIAL STATE
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

        // RESTORE SESSION ON REFRESH
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

      //  MAIN LOGIN FUNCTION (DUAL MODE)
      //  MODE 1 → login(email, password)
      //  MODE 2 → login(userObject, token)  ← For Google OAuth
  const login = async (emailOrUserObject, passwordOrToken) => {
    setLoading(true);

    try {
      // 🔹 MODE 2: Google login (direct entry)
      if (typeof emailOrUserObject === "object" && passwordOrToken) {
        const userData = emailOrUserObject;
        const accessToken = passwordOrToken;

        setUser(userData);
        setToken(accessToken);

        localStorage.setItem("blog_user", JSON.stringify(userData));
        localStorage.setItem("blog_token", accessToken);
        localStorage.setItem("blog_userId", userData._id);

        return { success: true };
      }

      // 🔹 MODE 1: Email/password login
      const email = emailOrUserObject;
      const password = passwordOrToken;

      const res = await API.post("/auth/login", { email, password });

      const { accessToken, user: userData } = res.data;

      const fixedUser = { ...userData, _id: userData._id || userData.id };

      setUser(fixedUser);
      setToken(accessToken);

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

                // REGISTER
  const register = async (name, email, password) => {
    setLoading(true);

    try {
      const res = await API.post("/auth/register", { name, email, password });

      if (res.data?.message) {
        return { success: true };
      }

      return {
        success: false,
        message: "Unexpected response from server",
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

                // LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("blog_user");
    localStorage.removeItem("blog_token");
    localStorage.removeItem("blog_userId");

    API.post("/auth/logout").catch(() => {});
  };

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
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
