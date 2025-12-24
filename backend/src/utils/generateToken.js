const jwt = require("jsonwebtoken");


const generateToken = (user) => {
  if (!user || !user._id) {
    throw new Error("User data is required to generate token");
  }

  return jwt.sign(
    {
      id: user._id.toString(), 
      role: user.role,         
    },
    process.env.JWT_SECRET,   
    {
      expiresIn: "7d",
    }
  );
};

module.exports = generateToken;
