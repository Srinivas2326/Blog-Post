const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* ======================================================
   AUTH MIDDLEWARE
   - Verifies access token
   - Always fetches fresh user from DB
   - Blocks inactive users (except admin)
====================================================== */
const protect = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, token missing",
      });
    }

    // 2️⃣ Verify JWT
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // 3️⃣ Always fetch latest user from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }

    // 4️⃣ Block inactive users (admins excluded if needed)
    if (!user.isActive && user.role !== "admin") {
      return res.status(403).json({
        message: "Your account has been deactivated by admin",
      });
    }

    // 5️⃣ Attach FULL user object to req
    req.user = {
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized",
      error: error.message,
    });
  }
};

module.exports = protect;
