const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

module.exports = {
  getProfile: async (req, res) => {
    try {
      //the Post.find() function is the name "Post" given to the schema in "/models/Post.js"
      const posts = await Post.find({ user: req.user.id });
      //views are going through the controller first
      //two views do no speak to each other. always through the controller
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "asc" }).lean();
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const comments = await Comment.find({ post: req.params.id })
        .sort({ createdAt: "asc" })
        .lean();
      res.render("post.ejs", {
        post: post,
        user: req.user,
        comments: comments,
      });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      //we are using the "result" of the await cloudinary to input into the
      //post model
      const result = await cloudinary.uploader.upload(req.file.path);

      //the inputs from the form will populate this schema
      //information from the form
      //information from the "req"
      await Post.create({
        //data from the request
        title: req.body.title,
        //data from the cloudinary upload
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        //manual set to 0
        likes: 0,
        //data from authentication
        user: req.user.id,
      });
      console.log("Post has been added!");
      //after the log, brings you back to the submite form page of your user
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
