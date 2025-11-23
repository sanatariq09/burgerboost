import express from "express";
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlog,
  getCategories
} from "../controllers/blog.controller.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// Get all blogs with pagination and filtering
router.get("/", getBlogs);

// Get single blog
router.get("/:id", getBlog);

// Create new blog
router.post("/", upload.single("image"), createBlog);

// Update blog
router.put("/:id", upload.single("image"), updateBlog);

// Delete blog
router.delete("/:id", deleteBlog);

// In your routes file
router.get('/categories', getCategories);
export default router;