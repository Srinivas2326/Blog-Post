const jwt = require("jsonwebtoken");

/**
 * Generate JWT access token
 * @param {Object} user - MongoDB user document
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  if (!user || !user._id) {
    throw new Error("User data is required to generate token");
  }

  return jwt.sign(
    {
      id: user._id.toString(), // ensure string
      role: user.role,         // used for role-based access
    },
    process.env.JWT_SECRET,    // MUST exist in Render env
    {
      expiresIn: "7d",
    }
  );
};

module.exports = generateToken;
