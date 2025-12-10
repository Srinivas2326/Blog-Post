const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/postController");

const router = express.Router();

  //  PUBLIC ROUTES

// Get all posts (public)
router.get("/", getAllPosts);

// Get single post + increment view count
router.get("/:id", getPostById);

  //  PROTECTED ROUTES

// Create Post (Only author/admin can create)
router.post("/", protect, authorizeRoles("author", "admin"), createPost);

// Update Post (Only author of that post can update)
router.put("/:id", protect, updatePost);

// Delete Post (Author or Admin can delete)
router.delete("/:id", protect, deletePost);

module.exports = router;
