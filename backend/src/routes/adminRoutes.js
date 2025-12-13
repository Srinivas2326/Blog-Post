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
 * 🔹 Only existing users (deleted users are gone forever)
 */
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

/**
 * 🔥 DELETE USER PERMANENTLY (DATABASE DELETE)
 * Admin cannot delete self
 */
router.delete("/users/:id", async (req, res) => {
  try {
    // ❌ Prevent admin deleting himself
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        message: "Admin cannot delete their own account",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 DELETE ALL POSTS BY USER
    await Post.deleteMany({ author: user._id });

    // 🔥 DELETE USER FROM DATABASE
    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "User permanently deleted from database",
    });
  } catch (error) {
    console.error("ADMIN DELETE USER ERROR:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

/* ======================================================
   POSTS MANAGEMENT
====================================================== */

/**
 * GET ALL POSTS (Admin View)
 */
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "_id name email role")
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
