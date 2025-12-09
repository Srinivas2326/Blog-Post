const User = require("../models/User");

// GET ALL USERS (Admin only)
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// GET SINGLE USER (Admin only)
exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// UPDATE USER ROLE OR INFO (Admin only)
exports.updateUser = async (req, res) => {
  const { name, email, role, isActive } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = name || user.name;
  user.email = email || user.email;
  user.role = role || user.role;
  user.isActive = isActive ?? user.isActive;

  await user.save();

  res.json({ message: "User updated", user });
};

// UPDATE USER PERMISSIONS (Admin only)
exports.updatePermissions = async (req, res) => {
  const { permissions } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  user.permissions = permissions;

  await user.save();

  res.json({ message: "Permissions updated", user });
};

// DELETE USER (Admin only)
exports.deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  await user.deleteOne();

  res.json({ message: "User deleted" });
};
