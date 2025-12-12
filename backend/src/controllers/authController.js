const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");
const bcrypt = require("bcryptjs");

// ---------------- REGISTER ------------------
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    // Create user
    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------- LOGIN ------------------
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    // Compare password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // Generate Tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Cookie flags
    const isProd = process.env.NODE_ENV === "production";

    // Store refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,           // true in production (HTTPS)
      sameSite: "none",        // allow cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "Login successful",
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};