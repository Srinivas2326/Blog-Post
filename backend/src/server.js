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

/* ==============================================
   ALLOWED ORIGINS (Dynamic for Deployment)
============================================== */
const allowedOrigins = (process.env.ALLOWED_ORIGINS ||
  "http://localhost:5173"
)
  .split(",")
  .map((o) => o.trim());

/* ==============================================
   CORS CONFIG
============================================== */
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
  })
);

/* ==============================================
   MIDDLEWARE
============================================== */
app.use(express.json());
app.use(cookieParser());

/* ==============================================
   ROUTES
============================================== */
app.use("/api/auth", authRoutes);
app.use("/api/auth", passwordRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

app.get("/api/health", (req, res) =>
  res.json({ status: "ok", message: "Backend is live 🚀" })
);

/* ==============================================
   DB + SERVER START
============================================== */
connectDB()
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Error:", err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
