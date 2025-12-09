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

// PUBLIC ROUTES
router.get("/", getAllPosts);
router.get("/:id", getPostById);

// AUTHOR ROUTES
router.post("/", protect, authorizeRoles("author", "admin"), createPost);
router.put("/:id", protect, authorizeRoles("author", "admin"), updatePost);

// DELETE: only author of the post or admin
router.delete("/:id", protect, authorizeRoles("author", "admin"), deletePost);

module.exports = router;
