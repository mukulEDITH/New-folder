const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String },
  content: { type: String },
  author: { type: String },
  Comment:{
    type:String
  }
});

const Blog = mongoose.model('Post', blogSchema);

module.exports = Blog;
