const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");

/* ============================================================
                      REGISTER (EMAIL + PASSWORD)
============================================================ */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({
      name,
      email,
      password,
      role: role || "author",
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

/* ============================================================
                 LOGIN (EMAIL + PASSWORD)
============================================================ */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email }).select("+password");

    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    if (!user.password) {
      return res.status(400).json({
        message: "This account uses Google login only. Please continue with Google.",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const isProd = process.env.NODE_ENV === "production";

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
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
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

/* ============================================================
                        GOOGLE AUTH LOGIN
============================================================ */
exports.googleAuthUser = async (req, res) => {
  try {
    const { email, name, googleId } = req.body;

    console.log("📥 Google Login Payload:", req.body);

    if (!email || !googleId)
      return res.status(400).json({ message: "Invalid Google auth data" });

    let user = await User.findOne({ email }).select("+password");

    if (user) {
      console.log("👤 Existing user found");

      // Convert normal user → Google login
      if (!user.googleId) {
        console.log("🔄 Converting Password user → Google login");

        user.googleId = googleId;
        user.password = undefined;

        // ⛔ IMPORTANT FIX
        await user.save({ validateBeforeSave: false });
      }
    } else {
      console.log("🆕 Creating NEW Google user");

      user = await User.create({
        name,
        email,
        googleId,
        password: undefined, // prevent validation
        role: "author",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const isProd = process.env.NODE_ENV === "production";

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log("✅ Google Login Success");

    return res.status(200).json({
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
    console.error("🔥 GOOGLE LOGIN ERROR:", error);
    return res.status(500).json({
      message: "Google login failed",
      error: error.message,
    });
  }
};
