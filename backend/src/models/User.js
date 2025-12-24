const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    // Google OAuth users
    googleId: {
      type: String,
      default: null,
    },

    // Password only for email/password users
    password: {
      type: String,
      minlength: 6,
      required: function () {
        return !this.googleId;
      },
      select: false,
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

    // Password reset
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

  //  HASH PASSWORD 
userSchema.pre("save", async function () {
  // Skip if password not modified OR Google user
  if (!this.isModified("password") || !this.password) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

  //  MATCH PASSWORD
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

  //  RESET PASSWORD TOKEN
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 min

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
