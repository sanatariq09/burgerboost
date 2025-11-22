import Product from "../models/product.model.js";

// Get all products with pagination and search
export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const search = req.query.search || "";

    console.log("📥 Backend - Fetching products:", { page, limit, search });

    // Validate inputs
    if (page < 1 || limit < 1) {
      return res.status(400).json({ 
        message: 'Invalid page or limit value',
        products: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalProducts: 0,
          hasNext: false,
          hasPrev: false
        }
      });
    }

    const skip = (page - 1) * limit;
    
    // Build search query
    let query = {};
    if (search && search.trim() !== "") {
      query.name = { $regex: search.trim(), $options: 'i' };
    }

    console.log("🔍 MongoDB Query:", query);

    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    console.log(`✅ Found ${products.length} products, Total: ${totalProducts}`);

    res.json({
      products: products || [],
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('❌ Backend Error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      products: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalProducts: 0,
        hasNext: false,
        hasPrev: false
      }
    });
  }
};

// Get single product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('❌ Get product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create product
export const createProduct = async (req, res) => {
  try {
    const { name, price, quantity, description } = req.body;
    
    // Validation
    if (!name || !price || !quantity) {
      return res.status(400).json({ message: 'Name, price and quantity are required' });
    }

    const productData = {
      name: name.trim(),
      price: parseFloat(price),
      quantity: parseInt(quantity),
      description: description?.trim() || ""
    };

    if (req.file) {
      productData.image = `/uploads/${req.file.filename}`;
    }

    const product = new Product(productData);
    await product.save();

    console.log("✅ Product created:", product._id);
    res.status(201).json(product);
  } catch (error) {
    console.error('❌ Create product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { name, price, quantity, description } = req.body;
    
    const updateData = {
      name: name?.trim(),
      price: parseFloat(price),
      quantity: parseInt(quantity),
      description: description?.trim() || ""
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log("✅ Product updated:", product._id);
    res.json(product);
  } catch (error) {
    console.error('❌ Update product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    console.log("✅ Product deleted:", req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('❌ Delete product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};