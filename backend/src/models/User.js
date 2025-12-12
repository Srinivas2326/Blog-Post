const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // ⭐ For Google OAuth Users
    googleId: {
      type: String,
      default: null,
    },

    // Normal password login users
    password: {
      type: String,
      minlength: 6,
      required: function () {
        // Password required ONLY IF not Google login
        return !this.googleId;
      },
      select: false, // Important: do NOT return password in API responses
    },

    role: {
      type: String,
      enum: ["admin", "author"],
      default: "author",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    permissions: {
      type: [String],
      default: [],
    },

    // ⭐ Forgot password support
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

/* ============================================================
   HASH PASSWORD ONLY IF:
   1) user is NOT Google user
   2) password is new/modified
============================================================ */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

/* ============================================================
   CHECK PASSWORD MATCH (Email/Password Users Only)
============================================================ */
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false; // Google users have no password
  return await bcrypt.compare(enteredPassword, this.password);
};

/* ============================================================
   GENERATE RESET PASSWORD TOKEN
============================================================ */
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
