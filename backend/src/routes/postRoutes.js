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

// PUBLIC ROUTES
router.get("/", getAllPosts);
router.get("/:id", getPostById);

// AUTHOR OR ADMIN CAN CREATE
router.post("/", protect, authorizeRoles("author", "admin"), createPost);

// AUTHOR OR ADMIN CAN UPDATE
router.put("/:id", protect, authorizeRoles("author", "admin"), updatePost);

// AUTHOR OR ADMIN CAN DELETE
router.delete("/:id", protect, authorizeRoles("author", "admin"), deletePost);

module.exports = router;
