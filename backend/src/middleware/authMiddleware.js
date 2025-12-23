const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    // 1️ Extract token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, token missing",
      });
    }

    // 2️ Verify JWT token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET
    );

    // 3️ Fetch fresh user from database
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }

    // 4️ Block inactive users (except admin)
    if (!user.isActive && user.role !== "admin") {
      return res.status(403).json({
        message: "Your account has been deactivated by admin",
      });
    }

    // 5️ Attach user info to request
    req.user = {
      _id: user._id,
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, token invalid or expired",
    });
  }
};

module.exports = protect;
