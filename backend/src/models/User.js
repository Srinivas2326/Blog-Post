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

    //  GOOGLE USERS WILL HAVE THIS
    googleId: {
      type: String,
      default: null,
    },

    //  PASSWORD ONLY REQUIRED FOR NON-GOOGLE USERS
    password: {
      type: String,
      minlength: 6,
      required: function () {
        return !this.googleId; // Google users don't need password
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

    //  PASSWORD RESET SUPPORT
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

  //  HASH PASSWORD 
userSchema.pre("save", async function () {

  if (!this.isModified("password") || !this.password) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

  //  PASSWORD MATCH CHECK
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false; // Google users have no password
  return await bcrypt.compare(enteredPassword, this.password);
};

  //  GENERATE PASSWORD RESET TOKEN
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Valid for 10 minutes
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
