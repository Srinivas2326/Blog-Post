const express = require("express");
const router = express.Router();

const {
  getUserPublicProfile,
  updateMyProfile,
  changePassword,        // ✅ NEW
  getAllUsers,
  getUserById,
  updateUser,
  updatePermissions,
  deleteUser
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");


// -----------------------------------------------------
// PUBLIC ROUTE – View any user's public profile
// -----------------------------------------------------
router.get("/profile/:id", getUserPublicProfile);


// -----------------------------------------------------
// LOGGED-IN USER ROUTES
// -----------------------------------------------------

// Update own profile
router.put("/me", protect, updateMyProfile);

// Change password
router.put("/change-password", protect, changePassword);   // ✅ ADDED


// -----------------------------------------------------
// ADMIN ROUTES
// -----------------------------------------------------
router.get("/", protect, authorizeRoles("admin"), getAllUsers);
router.get("/:id", protect, authorizeRoles("admin"), getUserById);
router.put("/:id", protect, authorizeRoles("admin"), updateUser);
router.put("/permissions/:id", protect, authorizeRoles("admin"), updatePermissions);
router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);


module.exports = router;
