const jwt = require("jsonwebtoken");

/* =========================================
   ACCESS TOKEN
   - Short lived
   - Used for API authorization
   - Contains role for admin checks
========================================= */
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role, // ✅ REQUIRED for admin access
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

/* =========================================
   REFRESH TOKEN
   - Long lived
   - Used to re-issue access tokens
   - Also includes role (important)
========================================= */
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role, // ✅ KEEP ROLE HERE TOO
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
