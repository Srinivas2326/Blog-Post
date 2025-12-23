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

    // Password only for non-Google users
    password: {
      type: String,
      minlength: 6,
      required: function () {
        return !this.googleId;
      },
      select: false, // 🔐 Never return password by default
    },

    // USER ROLE
    role: {
      type: String,
      enum: ["admin", "author"],
      default: "author",
    },

    // SOFT DELETE SUPPORT
    isActive: {
      type: Boolean,
      default: true,
    },

    // Optional future permissions
    permissions: {
      type: [String],
      default: [],
    },

    // PASSWORD RESET
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);



// HASH PASSWORD BEFORE SAVE
userSchema.pre("save", async function (next) {
  // If password not modified or not present, skip hashing
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});



// MATCH PASSWORD
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};



// GENERATE PASSWORD RESET TOKEN
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
