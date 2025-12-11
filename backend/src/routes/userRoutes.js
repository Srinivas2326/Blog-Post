const express = require("express");
const router = express.Router();

const {
  getUserPublicProfile,
  updateMyProfile,
  changePassword,
  getAllUsers,
  getUserById,
  updateUser,
  updatePermissions,
  deleteUser
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");


// PUBLIC PROFILE
router.get("/profile/:id", getUserPublicProfile);

// UPDATE OWN PROFILE
router.put("/me", protect, updateMyProfile);

// CHANGE PASSWORD
router.put("/change-password", protect, changePassword);

// ADMIN ROUTES
router.get("/", protect, authorizeRoles("admin"), getAllUsers);
router.get("/:id", protect, authorizeRoles("admin"), getUserById);
router.put("/:id", protect, authorizeRoles("admin"), updateUser);
router.put("/permissions/:id", protect, authorizeRoles("admin"), updatePermissions);
router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);

module.exports = router;
