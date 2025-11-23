import Blog from "../models/blog.model.js";

// Get available categories
export const getCategories = async (req, res) => {
  try {
    // Get categories from blog schema enum if available, otherwise use default
    const categories = (await Blog.schema.path("category").enumValues) || [
      "Technology",
      "Travel",
      "Food",
      "Lifestyle",
      "Health",
      "Cooking",
      "Business",
      "Personal",
    ];
    console.log("Available categories:", categories);
    res.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    // Fallback categories
    res.json([
      "Technology",
      "Travel",
      "Food",
      "Lifestyle",
      "Health",
      "Cooking",
      "Business",
      "Personal",
    ]);
  }
};

// Get all blogs with pagination and filtering
export const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category || "";
    const search = req.query.search || "";

    console.log("Fetching blogs:", { page, limit, category, search });

    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { body: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const blogs = await Blog.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalBlogs = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalBlogs / limit);

    console.log(` Found ${blogs.length} blogs, Total: ${totalBlogs}`);

    res.json({
      blogs,
      pagination: {
        currentPage: page,
        totalPages,
        totalBlogs,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Blog fetch error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single blog
export const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (error) {
    console.error(" Get blog error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create blog
export const createBlog = async (req, res) => {
  try {
    const { title, body, author, tags, category, featured } = req.body;

    if (!title || !body || !category) {
      return res
        .status(400)
        .json({ message: "Title, body and category are required" });
    }

    // Validate category against enum values
    const validCategories = (await Blog.schema.path("category").enumValues) || [
      "Technology",
      "Travel",
      "Food",
      "Lifestyle",
      "Health",
      "Cooking",
      "Business",
      "Personal",
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        message: `Invalid category. Must be one of: ${validCategories.join(
          ", "
        )}`,
        validCategories,
      });
    }

    const blogData = {
      title: title.trim(),
      body: body.trim(),
      author: author?.trim() || "Sana Tariq",
      tags: Array.isArray(tags)
        ? tags
        : tags?.split(",").map((tag) => tag.trim()) || [],
      category,
      featured: featured === "true",
    };

    if (req.file) {
      blogData.image = `/uploads/${req.file.filename}`;
    }

    const blog = new Blog(blogData);
    await blog.save();

    console.log("Blog created:", blog._id);
    res.status(201).json(blog);
  } catch (error) {
    console.error("Create blog error:", error);

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update blog
export const updateBlog = async (req, res) => {
  try {
    const { title, body, author, tags, category, featured } = req.body;

    const updateData = {
      ...(title && { title: title.trim() }),
      ...(body && { body: body.trim() }),
      ...(author && { author: author.trim() }),
      ...(tags && {
        tags: Array.isArray(tags)
          ? tags
          : tags.split(",").map((tag) => tag.trim()),
      }),
      ...(category && { category }),
      featured: featured === "true",
    };

    // Validate category if provided
    if (category) {
      const validCategories = (await Blog.schema.path("category")
        .enumValues) || [
        "Technology",
        "Travel",
        "Food",
        "Lifestyle",
        "Health",
        "Cooking",
        "Business",
        "Personal",
      ];

      if (!validCategories.includes(category)) {
        return res.status(400).json({
          message: `Invalid category. Must be one of: ${validCategories.join(
            ", "
          )}`,
          validCategories,
        });
      }
    }

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    console.log("Blog updated:", blog._id);
    res.json(blog);
  } catch (error) {
    console.error("Update blog error:", error);

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    console.log("Blog deleted:", req.params.id);
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
