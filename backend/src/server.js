// ==========================
//  IMPORTS
// ==========================
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


// =====================================================
//  ⭐ ALLOWED ORIGINS (NO TRAILING SLASHES)
// =====================================================
const allowedOrigins = [
  "http://localhost:5173",                       // Local frontend
  "https://blog-post-iota-eosin.vercel.app",     // Vercel frontend
  "https://blog-post-5elh.onrender.com"          // Backend render domain
];


// =====================================================
//  ⭐ MAIN CORS MIDDLEWARE (MUST COME FIRST)
// =====================================================
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.log("❌ Blocked by CORS:", origin);
      return callback(new Error("CORS blocked: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// =====================================================
// ⭐ REQUIRED MANUAL HEADERS (Render needs this)
// =====================================================
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});


// =====================================================
// ⭐ BODY PARSER + COOKIES
// =====================================================
app.use(express.json());
app.use(cookieParser());


// =====================================================
// ⭐ ROUTES
// =====================================================
app.use("/api/auth", authRoutes);
app.use("/api/auth", passwordRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);


// =====================================================
// ⭐ HEALTH CHECK
// =====================================================
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend is live 🚀",
  });
});


// =====================================================
// ⭐ DATABASE CONNECTION
// =====================================================
connectDB()
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Error:", err);
    process.exit(1);
  });


// =====================================================
// ⭐ START SERVER
// =====================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
