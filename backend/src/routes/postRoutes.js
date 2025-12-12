const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getMyPosts
} = require("../controllers/postController");

const router = express.Router();

// PUBLIC ROUTES
router.get("/", getAllPosts);
router.get("/:id", getPostById);

// ⭐ PROTECTED → GET ONLY LOGGED-IN USER POSTS
router.get("/mine", protect, getMyPosts);

// CREATE POST
router.post("/", protect, authorizeRoles("author", "admin"), createPost);

// UPDATE POST
router.put("/:id", protect, updatePost);

// DELETE POST
router.delete("/:id", protect, deletePost);

module.exports = router;
