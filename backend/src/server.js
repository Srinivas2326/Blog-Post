// src/server.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const passwordRoutes = require("./routes/passwordRoutes");

dotenv.config();

const app = express();

// ------------------------------
// Middlewares
// ------------------------------
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL (Vite)
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ------------------------------
// API Routes
// ------------------------------
app.use("/api/auth", authRoutes);         // login, register
app.use("/api/auth", passwordRoutes);     // forgot/reset password
app.use("/api/protected", protectedRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

// ------------------------------
// Health Check Route
// ------------------------------
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend server is running 🚀",
  });
});

// ------------------------------
// Connect to Database
// ------------------------------
connectDB()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });

// ------------------------------
// Start Server
// ------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
