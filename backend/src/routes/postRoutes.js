const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createPost,
  getAllPosts,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
} = require("../controllers/postController");

const router = express.Router();

// PUBLIC ROUTES
router.get("/", getAllPosts);
router.get("/:id", getPostById);

// PROTECTED ROUTES
router.get("/mine", protect, getMyPosts); // <-- IMPORTANT

router.post("/", protect, authorizeRoles("author", "admin"), createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

module.exports = router;
