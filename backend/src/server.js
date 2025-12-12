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

dotenv.config();
const app = express();

/* =====================================================
   ⭐ CORS FIX (ONLY THIS — DO NOT DUPLICATE)
===================================================== */
const allowedOrigins = [
  "http://localhost:5173",
  "https://blog-post-iota-eosin.vercel.app",
  "https://blog-post-5elh.onrender.com"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization"
  })
);

// ⭐ REQUIRED FIX — Handle preflight OPTIONS requests
app.options("*", cors());

/* =====================================================
   Middlewares
===================================================== */
app.use(express.json());
app.use(cookieParser());

/* =====================================================
   Routes
===================================================== */
app.use("/api/auth", authRoutes);
app.use("/api/auth", passwordRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

/* =====================================================
   Health Check
===================================================== */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend running 🚀" });
});

/* =====================================================
   DB Connection
===================================================== */
connectDB()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });

/* =====================================================
   Start Server
===================================================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
