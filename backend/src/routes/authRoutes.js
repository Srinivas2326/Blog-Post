const express = require("express");
const {
  registerUser,
  loginUser,
  googleAuthUser,
} = require("../controllers/authController");

const router = express.Router();

// Email/Password Auth
router.post("/register", registerUser);
router.post("/login", loginUser);

// ⭐ Google OAuth Login (Frontend → Backend)
router.post("/google", googleAuthUser);

module.exports = router;
