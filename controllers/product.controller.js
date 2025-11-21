import Product from "../models/product.model.js";

// Get all products WITH PAGINATION AND CATEGORIES
export async function getProducts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const search = req.query.search || '';
    const category = req.query.category || '';

    console.log(`Fetching products - Page: ${page}, Limit: ${limit}, Search: "${search}", Category: "${category}"`);

    // Build search query
    let query = {};
    if (search && search.trim() !== '') {
      // EXACT MATCH ONLY when searching
      query = { name: { $regex: `^${search.trim()}$`, $options: 'i' } };
    } else if (category && category.trim() !== '') {
      // Filter by category
      query = { category: { $regex: category, $options: 'i' } };
    }

    const options = {
      page: page,
      limit: limit,
      sort: { createdAt: -1 }
    };

    const result = await Product.paginate(query, options);

    // Get all categories for filter
    const categories = await Product.distinct('category');

    res.status(200).json({
      products: result.docs,
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalProducts: result.totalDocs,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage
      },
      categories: categories
    });

  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ message: error.message });
  }
}

// Get products by category
export async function getProductsByCategory(req, res) {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    const options = {
      page: page,
      limit: limit,
      sort: { createdAt: -1 }
    };

    const result = await Product.paginate(
      { category: { $regex: category, $options: 'i' } }, 
      options
    );

    res.status(200).json({
      products: result.docs,
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalProducts: result.totalDocs,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage
      },
      category: category
    });

  } catch (error) {
    console.error("Error fetching products by category:", error.message);
    res.status(500).json({ message: error.message });
  }
}
export async function getProduct(req, res) {
}

export async function createProduct(req, res) {
}

export async function updateProduct(req, res) {
}

export async function deleteProduct(req, res) {
}