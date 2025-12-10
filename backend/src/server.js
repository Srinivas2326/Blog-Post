// src/server.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const passwordRoutes = require("./routes/passwordRoutes");

// Load environment variables
dotenv.config();

const app = express();

/* ===============================
   CORS Configuration (IMPORTANT)
   =============================== */
const allowedOrigins = [
  "http://localhost:5173",                  // local Vite
  process.env.CLIENT_URL,                   // Vercel frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ===============================
   Middlewares
   =============================== */
app.use(express.json());
app.use(cookieParser());

/* ===============================
   API Routes
   =============================== */
app.use("/api/auth", authRoutes);
app.use("/api/auth", passwordRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

/* ===============================
   Health Check
   =============================== */
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Backend server is running 🚀",
  });
});

/* ===============================
   Database Connection
   =============================== */
connectDB()
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });

/* ===============================
   Start Server
   =============================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
