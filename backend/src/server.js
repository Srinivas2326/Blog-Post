// backend/src/server.js
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
   ALLOWED ORIGINS
   - no trailing slashes
   - add your frontends (local + deploy) here
===================================================== */
const allowedOrigins = [
  "http://localhost:5173",                     // local vite
  "https://blog-post-iota-eosin.vercel.app",   // your vercel frontend
  "https://blog-post-5elh.onrender.com"        // your render backend url
];

/* =====================================================
   CORS - main middleware (must be applied before routes)
===================================================== */
app.use(
  cors({
    origin: function (origin, callback) {
      // allow non-browser requests (e.g. Postman) with no origin
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.log("❌ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* =====================================================
   Manual headers for preflight / some browsers
   (Render and cross-site cookies benefit from this)
===================================================== */
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// Body parser and cookies
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);         // login, register
app.use("/api/auth", passwordRoutes);     // forgot/reset password
app.use("/api/protected", protectedRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

// Healthcheck
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", message: "Backend is live 🚀" })
);

// Connect DB and start server
connectDB()
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Error:", err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
