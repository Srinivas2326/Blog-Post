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

/* =====================================================
   ⭐ CORRECT CORS SETTINGS (LOCAL + DEPLOY)
===================================================== */
const allowedOrigins = [
  "http://localhost:5173",
  "https://blog-post-5elh.onrender.com",        // Render backend
  "https://your-frontend-domain.netlify.app",   // Update after frontend deploy
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.log("❌ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS: " + origin), false);
    },
    credentials: true,
  })
);

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
  res.json({
    status: "ok",
    message: "Backend server is running 🚀",
  });
});

/* =====================================================
   ⭐ DATABASE CONNECTION
===================================================== */
connectDB()
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });

/* =====================================================
   ⭐ START SERVER
===================================================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
