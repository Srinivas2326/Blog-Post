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
    },

    // ⭐ For Google OAuth Users – not required
    googleId: {
      type: String,
      default: null,
    },

    password: {
      type: String,
      minlength: 6,
      required: function () {
        return !this.googleId; // Password required only for non-Google users
      },
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

    // ⭐ Forgot / Reset password fields
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

    // HASH PASSWORD (only for non-Google users)
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

    //  PASSWORD MATCH CHECK
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

    //  RESET TOKEN GENERATOR
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
