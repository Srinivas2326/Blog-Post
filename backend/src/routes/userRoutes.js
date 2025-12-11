const express = require("express");
const router = express.Router();

const {
  getUserPublicProfile,
  getAllUsers,
  getUserById,
  updateUser,
  updatePermissions,
  deleteUser
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// ✅ PUBLIC USER PROFILE ROUTE
router.get("/profile/:id", getUserPublicProfile);

// ✅ ADMIN ROUTES
router.get("/", protect, authorizeRoles("admin"), getAllUsers);
router.get("/:id", protect, authorizeRoles("admin"), getUserById);
router.put("/:id", protect, authorizeRoles("admin"), updateUser);
router.put("/permissions/:id", protect, authorizeRoles("admin"), updatePermissions);
router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);

module.exports = router;
