const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
} = require("../controllers/postController");

const router = express.Router();

// Public Routes
router.get("/", getAllPosts);
router.get("/:id", getPostById);

// Create Post (Must be author or admin)
router.post("/", protect, authorizeRoles("author", "admin"), createPost);

// Update (Author only)
router.put("/:id", protect, updatePost);

// Delete (Author or Admin)
router.delete("/:id", protect, deletePost);

module.exports = router;
