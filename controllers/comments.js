const Comment = require("../models/Comment");

module.exports = {
  createComment: async (req, res) => {
    try {
      //taken from controller/post.js
      // const commentUser = await User.findById(req.user.id);
      await Comment.create({
        comment: req.body.comment,
        likes: 0,
        post: req.params.id,
        //TODO - add new properties to each new document
        createdBy: req.user.userName,
        createdByID: req.user.id,
      });
      console.log("Comment has been added!");
      res.redirect("/post/" + req.params.id);
    } catch (err) {
      console.log(err);
    }
  },
};
