const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getAllUsers,
  getUserById,
  updateUser,
  updatePermissions,
  deleteUser
} = require("../controllers/userController");

const router = express.Router();

// Admin-only routes
router.get("/", protect, authorizeRoles("admin"), getAllUsers);
router.get("/:id", protect, authorizeRoles("admin"), getUserById);
router.put("/:id", protect, authorizeRoles("admin"), updateUser);
router.put("/permissions/:id", protect, authorizeRoles("admin"), updatePermissions);
router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);

module.exports = router;
