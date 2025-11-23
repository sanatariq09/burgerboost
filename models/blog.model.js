import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Blog title is required"],
    trim: true,
    maxlength: [200, "Title cannot exceed 200 characters"]
  },
  body: {
    type: String,
    required: [true, "Blog content is required"],
    trim: true
  },
  author: {
    type: String,
    required: [true, "Author name is required"],
    default: "Sana Tariq"
  },
  tags: [{
    type: String,
    trim: true
  }],
  // models/Blog.js
category: {
  type: String,
  required: true,
  enum: {
    values: ['Technology', 'Travel', 'Food', 'Lifestyle', 'Health', 'Cooking'],
    message: '{VALUE} is not a valid category'
  }
},
  image: {
    type: String,
    default: ""
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Blog = mongoose.model("blog", blogSchema);

export default Blog;