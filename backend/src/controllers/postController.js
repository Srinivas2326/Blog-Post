const Post = require("../models/Post");

// CREATE POST
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = await Post.create({
      title,
      content,
      author: req.user._id,
      isPublished: true,
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET ALL POSTS (Public)
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "_id name email role");   // ✅ FIX ADDED

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch posts" });
  }
};

// GET SINGLE POST
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "_id name email role");  // ✅ Populate here also

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(404).json({ message: "Post not found" });
  }
};

// UPDATE POST
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can edit only your posts" });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;

    const updated = await post.save();

    res.json({
      message: "Post updated successfully",
      updated,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE POST
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this post" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
