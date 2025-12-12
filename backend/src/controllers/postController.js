const Post = require("../models/Post");

  //  CREATE POST
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = await Post.create({
      title,
      content,
      author: req.user._id,
      isPublished: true,
      viewCount: 0,
    });

    res.status(201).json({ message: "Post created", post });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

  //  GET MY POSTS (dashboard)
exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .sort({ createdAt: -1 });

    return res.json(posts);
  } catch (err) {
    return res.status(500).json({ message: "Failed to load posts" });
  }
};

  //  GET ALL POSTS
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "_id name email");

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch posts" });
  }
};

  //  GET POST BY ID
exports.getPostById = async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });

    const post = await Post.findById(req.params.id)
      .populate("author", "_id name email");

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
};

  //  UPDATE POST
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;

    const updated = await post.save();
    res.json({ message: "Post updated", updated });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

  //  DELETE POST
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
