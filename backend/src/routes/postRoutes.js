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

/* ======================================================
   PUBLIC ROUTES
====================================================== */
router.get("/", getAllPosts);
router.get("/:id", getPostById);

/* ======================================================
   AUTHENTICATED USER ROUTES
====================================================== */
router.get("/mine", protect, getMyPosts);

/* ======================================================
   AUTHOR / ADMIN ROUTES
====================================================== */

// Create post → author & admin
router.post(
  "/",
  protect,
  authorizeRoles("author", "admin"),
  createPost
);

// Update post → author (own post) OR admin (any post)
router.put(
  "/:id",
  protect,
  authorizeRoles("author", "admin"),
  updatePost
);

// Delete post → author (own post) OR admin (any post)
router.delete(
  "/:id",
  protect,
  authorizeRoles("author", "admin"),
  deletePost
);

module.exports = router;
