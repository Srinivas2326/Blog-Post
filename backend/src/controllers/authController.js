const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");
const bcrypt = require("bcryptjs");

/* ============================================================
                      REGISTER (EMAIL/PASSWORD)
============================================================ */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    // Create user normally
    const user = await User.create({
      name,
      email,
      password,
      role: role || "author",
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* ============================================================
                      LOGIN (EMAIL/PASSWORD)
============================================================ */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // Compare password (if account has a password)
    const isMatch = user.password
      ? await user.matchPassword(password)
      : false;

    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const isProd = process.env.NODE_ENV === "production";

    // Store refresh token as HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Login successful",
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* ============================================================
                      GOOGLE AUTH LOGIN
============================================================ */
exports.googleAuthUser = async (req, res) => {
  try {
    const { email, name, googleId } = req.body;

    if (!email || !googleId)
      return res.status(400).json({ message: "Invalid Google auth data" });

    let user = await User.findOne({ email });

    // ---------------------------------------------------------
    // CASE 1: User already exists → Login
    // ---------------------------------------------------------
    if (user) {
      // If user was originally email/password and now using Google,
      // store googleId safely:
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // ---------------------------------------------------------
      // CASE 2: First time Google login → Create user
      // ---------------------------------------------------------
      user = await User.create({
        name,
        email,
        googleId,
        role: "author", // default role for google users
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const isProd = process.env.NODE_ENV === "production";

    // Store Refresh token
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Google login successful",
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Google login failed", error: error.message });
  }
};
