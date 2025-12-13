const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* ======================================================
   AUTH MIDDLEWARE
   - Verifies access token
   - Attaches user info to req.user
   - Blocks inactive users
====================================================== */
const protect = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Extract token from Authorization header
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

    // 3️⃣ Fetch user from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }

    // 4️⃣ Block inactive users
    if (!user.isActive) {
      return res.status(403).json({
        message: "Account is deactivated",
      });
    }

    // 5️⃣ Attach user info to request
    req.user = {
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
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
