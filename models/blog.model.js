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
  category: {
    type: String,
    required: true,
    enum: ['cooking', 'quality', 'behind-scenes', 'story', 'recipes']
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