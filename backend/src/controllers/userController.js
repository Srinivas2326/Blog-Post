const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcryptjs");


// ======================================
// GET PUBLIC USER PROFILE
// ======================================
exports.getUserPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await Post.find({ author: req.params.id })
      .sort({ createdAt: -1 });

    res.json({ user, posts });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ======================================
// UPDATE OWN PROFILE
// ======================================
exports.updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.email = email;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ======================================
// CHANGE PASSWORD  ✅ FIXED
// ======================================
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;

    const { currentPassword, oldPassword, newPassword } = req.body;
    const passwordToCheck = currentPassword || oldPassword;

    if (!passwordToCheck || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters"
      });
    }

    // 🔴 THIS LINE IS THE KEY FIX
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(passwordToCheck, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect"
      });
    }

    user.password = newPassword; // bcrypt runs in pre-save hook
    await user.save();

    res.json({ message: "Password changed successfully" });

  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ======================================
// ADMIN CONTROLLERS
// ======================================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    if (typeof isActive === "boolean") {
      user.isActive = isActive;
    }

    await user.save();

    res.json({ message: "User updated successfully", user });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePermissions = async (req, res) => {
  try {
    const { permissions } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.permissions = permissions;
    await user.save();

    res.json({ message: "Permissions updated successfully", user });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
