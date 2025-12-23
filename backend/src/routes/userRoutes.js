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




// Public user profile
router.get("/profile/:id", getUserPublicProfile);


// Update own profile
router.put("/me", protect, updateMyProfile);

// Change password
router.put("/change-password", protect, changePassword);


// ADMIN ROUTES

router.get("/", protect, authorizeRoles("admin"), getAllUsers);
router.get("/:id", protect, authorizeRoles("admin"), getUserById);
router.put("/:id", protect, authorizeRoles("admin"), updateUser);
router.put("/:id/permissions", protect, authorizeRoles("admin"), updatePermissions);
router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);


module.exports = router;
