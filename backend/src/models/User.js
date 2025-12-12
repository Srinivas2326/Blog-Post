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
    },

    // ⭐ GOOGLE USERS WILL HAVE THIS
    googleId: {
      type: String,
      default: null,
    },

    // ⭐ PASSWORD ONLY REQUIRED FOR NON-GOOGLE USERS
    password: {
      type: String,
      minlength: 6,
      required: function () {
        return !this.googleId; // Google users don't need password
      },
      select: false, // Never send password in responses
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

    // ⭐ PASSWORD RESET SUPPORT
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

/* ============================================================
   HASH PASSWORD (ONLY WHEN CHANGED + ONLY FOR NORMAL USERS)
============================================================ */
userSchema.pre("save", async function (next) {
  try {
    // Skip hashing if password is not modified OR password doesn't exist (Google login)
    if (!this.isModified("password") || !this.password) {
      return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    next(error);
  }
});

/* ============================================================
   PASSWORD MATCH CHECK (ONLY EMAIL/PASSWORD USERS)
============================================================ */
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false; // Google users have no password stored
  return await bcrypt.compare(enteredPassword, this.password);
};

/* ============================================================
   GENERATE PASSWORD RESET TOKEN
============================================================ */
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // expires in 10 mins

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
