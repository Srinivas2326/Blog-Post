const User = require("../models/User");
const Post = require("../models/Post");

/* ---------------------------------------------------------
   PUBLIC USER PROFILE  (Accessible by everyone)
   GET /users/profile/:id
--------------------------------------------------------- */
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
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

/* ---------------------------------------------------------
   GET ALL USERS (Admin only)
--------------------------------------------------------- */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};

/* ---------------------------------------------------------
   GET SINGLE USER BY ID (Admin only)
--------------------------------------------------------- */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
};

/* ---------------------------------------------------------
   UPDATE USER INFO / ROLE (Admin only)
--------------------------------------------------------- */
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.isActive = isActive ?? user.isActive;

    await user.save();

    res.json({ message: "User updated", user });

  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err.message });
  }
};

/* ---------------------------------------------------------
   UPDATE USER PERMISSIONS (Admin only)
--------------------------------------------------------- */
exports.updatePermissions = async (req, res) => {
  try {
    const { permissions } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.permissions = permissions;
    await user.save();

    res.json({ message: "Permissions updated", user });

  } catch (err) {
    res.status(500).json({ message: "Error updating permissions", error: err.message });
  }
};

/* ---------------------------------------------------------
   DELETE USER (Admin only)
--------------------------------------------------------- */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();

    res.json({ message: "User deleted" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
};
