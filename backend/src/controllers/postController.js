const Post = require("../models/Post");

/* -----------------------------------------------------
   CREATE POST  (Author / Admin)
----------------------------------------------------- */
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = await Post.create({
      title,
      content,
      author: req.user._id,
      isPublished: true,
      viewCount: 0, // ensure field exists
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


/* -----------------------------------------------------
   GET ALL POSTS (Public)
----------------------------------------------------- */
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "_id name email role");

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch posts" });
  }
};


/* -----------------------------------------------------
   GET SINGLE POST + INCREMENT VIEW COUNT
----------------------------------------------------- */
exports.getPostById = async (req, res) => {
  try {
    // Increment view count safely
    await Post.findByIdAndUpdate(req.params.id, {
      $inc: { viewCount: 1 },
    });

    const post = await Post.findById(req.params.id)
      .populate("author", "_id name email role");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Error fetching post" });
  }
};


/* -----------------------------------------------------
   UPDATE POST (Author Only)
----------------------------------------------------- */
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


/* -----------------------------------------------------
   DELETE POST (Author or Admin)
----------------------------------------------------- */
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Only Author OR Admin can delete
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
