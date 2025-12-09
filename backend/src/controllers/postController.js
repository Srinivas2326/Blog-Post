const Post = require("../models/Post");

// CREATE POST (author only)
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = await Post.create({
      title,
      content,
      author: req.user._id
    });

    res.status(201).json({
      message: "Post created successfully",
      post
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET ALL POSTS (public)
exports.getAllPosts = async (req, res) => {
  const posts = await Post.find().populate("author", "name email role");
  res.json(posts);
};

// GET SINGLE POST (public)
exports.getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author", "name email role");
  res.json(post);
};

// UPDATE POST (only author of that post)
exports.updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) return res.status(404).json({ message: "Post not found" });

  if (post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You can edit only your own posts" });
  }

  post.title = req.body.title || post.title;
  post.content = req.body.content || post.content;

  const updated = await post.save();

  res.json({
    message: "Post updated",
    updated
  });
};

// DELETE POST (author or admin)
exports.deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) return res.status(404).json({ message: "Post not found" });

  if (post.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({ message: "You cannot delete this post" });
  }

  await post.deleteOne();

  res.json({ message: "Post deleted" });
};
