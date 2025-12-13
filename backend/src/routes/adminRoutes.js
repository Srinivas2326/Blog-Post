const express = require("express");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const User = require("../models/User");
const Post = require("../models/Post");

const router = express.Router();

/* ======================================================
   ALL ADMIN ROUTES
   protect → adminOnly
====================================================== */
router.use(protect, adminOnly);

/* ======================================================
   USERS MANAGEMENT
====================================================== */

/**
 * GET ALL USERS (Admin)
 * ❗ IMPORTANT: Exclude soft-deleted users
 */
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({ isActive: true }).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

/**
 * SOFT DELETE USER (Deactivate account)
 * Admin cannot deactivate self
 */
router.delete("/users/:id", async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        message: "Admin cannot deactivate their own account",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ SOFT DELETE USER
    user.isActive = false;
    await user.save();

    // OPTIONAL: hide all posts by this user
    await Post.updateMany(
      { author: user._id },
      { isPublished: false }
    );

    res.json({
      message: "User account deactivated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to deactivate user" });
  }
});

/**
 * REACTIVATE USER (Optional)
 */
router.put("/users/:id/activate", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = true;
    await user.save();

    // OPTIONAL: republish posts
    await Post.updateMany(
      { author: user._id },
      { isPublished: true }
    );

    res.json({ message: "User account reactivated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to reactivate user" });
  }
});

/* ======================================================
   POSTS MANAGEMENT
====================================================== */

/**
 * GET ALL POSTS (Admin View)
 * Includes posts from inactive users
 */
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "_id name email role isActive")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

/**
 * UPDATE ANY POST (Admin)
 */
router.put("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.title = req.body.title ?? post.title;
    post.content = req.body.content ?? post.content;

    const updatedPost = await post.save();

    res.json({
      message: "Post updated by admin",
      post: updatedPost,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update post" });
  }
});

/**
 * DELETE ANY POST (Admin)
 */
router.delete("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted by admin" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post" });
  }
});

module.exports = router;
