const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: true,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  caption: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    //reference to other schemas.
    //in this case it is User.js in models
    ref: "User",
  },
  createdAt: {
    type: Date,
    //if you did not set a date, it will set one for you
    default: Date.now,
  },
});
//exporting - a new model,
//naming it "Post",
//uses the "PostSchema",
//"specify a collection"
module.exports = mongoose.model("Post", PostSchema);
