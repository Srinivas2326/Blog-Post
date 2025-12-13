const Post = require("../models/Post");

/* ======================================================
   CREATE POST
   Author → Active only
   Admin  → Always allowed
====================================================== */
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    // ❌ Block ONLY inactive authors (NOT admin)
    if (!req.user.isActive && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Your account is deactivated",
      });
    }

    const post = await Post.create({
      title,
      content,
      author: req.user.id,
      isPublished: true,
      viewCount: 0,
    });

    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

/* ======================================================
   GET MY POSTS
====================================================== */
exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      author: req.user.id,
    }).sort({ createdAt: -1 });

    return res.json(posts);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load posts",
    });
  }
};

/* ======================================================
   GET ALL POSTS (Public)
   ❗ Hide posts of inactive users
====================================================== */
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate({
        path: "author",
        select: "_id name email role isActive",
        match: { isActive: true },
      })
      .sort({ createdAt: -1 });

    const filteredPosts = posts.filter(
      (post) => post.author !== null
    );

    return res.json(filteredPosts);
  } catch (error) {
    return res.status(500).json({
      message: "Could not fetch posts",
    });
  }
};

/* ======================================================
   GET POST BY ID
====================================================== */
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "_id name email role isActive"
    );

    if (!post || !post.author || !post.author.isActive) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    post.viewCount += 1;
    await post.save();

    return res.json(post);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching post",
    });
  }
};

/* ======================================================
   UPDATE POST
   Author → Own post (active only)
   Admin  → Any post
====================================================== */
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (
      post.author.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorized to update this post",
      });
    }

    post.title = req.body.title ?? post.title;
    post.content = req.body.content ?? post.content;

    const updatedPost = await post.save();

    return res.json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

/* ======================================================
   DELETE POST
   Author → Own post
   Admin  → Any post
====================================================== */
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (
      post.author.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorized to delete this post",
      });
    }

    await post.deleteOne();

    return res.json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
