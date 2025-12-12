const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const passwordRoutes = require("./routes/passwordRoutes");

dotenv.config();
const app = express();

/* =====================================================
   ⭐ ALLOWED ORIGINS (ONLY YOUR FRONTEND + LOCAL)
===================================================== */
const allowedOrigins = [
  "http://localhost:5173",
  "https://blog-post-iota-eosin.vercel.app",   // your Vercel frontend
];

/* =====================================================
   ⭐ MAIN CORS (must run BEFORE manual headers)
===================================================== */
app.use(
  cors({
    origin: function (origin, callback) {
      // allow REST clients (Postman etc)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ CORS BLOCKED:", origin);
      return callback(new Error("CORS not allowed: " + origin));
    },
    credentials: true,
  })
);

/* =====================================================
   ⭐ MANUAL HEADERS (must run AFTER cors())
===================================================== */
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

/* =====================================================
   ⭐ MIDDLEWARE
===================================================== */
app.use(express.json());
app.use(cookieParser());

/* =====================================================
   ⭐ API ROUTES
===================================================== */
app.use("/api/auth", authRoutes);
app.use("/api/auth", passwordRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

/* =====================================================
   ⭐ HEALTH CHECK
===================================================== */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running 🚀" });
});

/* =====================================================
   ⭐ DATABASE START
===================================================== */
connectDB()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => {
    console.error("❌ DB Error:", err);
    process.exit(1);
  });

/* =====================================================
   ⭐ START SERVER
===================================================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("🚀 Server running on port", PORT));
