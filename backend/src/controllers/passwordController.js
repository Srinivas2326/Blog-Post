const crypto = require("crypto");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// 📌 SEND PASSWORD RESET EMAIL
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "No user found with that email" });
    }

    // Generate token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // 🔥 Updated to Vercel URL instead of localhost
    const resetURL = `https://blog-post-iota-eosin.vercel.app/reset-password/${resetToken}`;

    const message = `
      You requested a password reset.
      Click the link below to reset your password:
      ${resetURL}
      
      If you did not request this, ignore this email.
    `;

    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message,
    });

    res.json({ message: "Reset email sent successfully" });

  } catch (error) {
    console.error("Email sending failed:", error);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500).json({
      message: "Email could not be sent",
      error: error.message,
    });
  }
};

// 📌 RESET PASSWORD USING TOKEN
exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
