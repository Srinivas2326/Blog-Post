const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Only logged in users
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Profile fetched",
    user: req.user
  });
});

// Only admin can access
router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
  res.json({
    message: "Admin route accessed!",
    user: req.user
  });
});

// Only authors
router.get("/author", protect, authorizeRoles("author"), (req, res) => {
  res.json({
    message: "Author route accessed!",
    user: req.user
  });
});

module.exports = router;
