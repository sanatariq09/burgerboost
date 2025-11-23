import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Blog.css";

function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Fallback images for products
  const fallbackImages = [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1606755962773-d324e7452492?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  ];

  // Blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "The Art of Perfect Burger Making",
      body: `Welcome to Sana's Burger Boots! As the owner, I believe that creating the perfect burger is an art form. It's not just about stacking ingredients; it's about creating a symphony of flavors that dance on your taste buds.`,
      author: "Sana Tariq",
      date: "January 15, 2024",
      tags: ["burgers", "cooking", "recipes"],
      category: "cooking",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      featured: true,
    },
    {
      id: 2,
      title: "Why Fresh Ingredients Matter",
      body: `Many people ask me why our burgers taste so different. The answer is simple: freshness matters. We never compromise on ingredient quality. Our vegetables are delivered daily from local farmers.`,
      author: "Sana Tariq",
      date: "January 10, 2024",
      tags: ["ingredients", "quality", "fresh"],
      category: "quality",
      image:
        "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      featured: false,
    },
  ];

  // Categories for filtering
  const categories = [
    { value: "all", label: "All Posts" },
    { value: "cooking", label: "Cooking Tips" },
    { value: "quality", label: "Quality" },
    { value: "behind-scenes", label: "Behind the Scenes" },
    { value: "story", label: "Our Story" },
    { value: "recipes", label: "Recipes" },
  ];

  // Image handling functions
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=No+Image";
    }
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    if (imagePath.startsWith("/uploads")) {
      return `http://localhost:4000${imagePath}`;
    }
    return `http://localhost:4000${imagePath}`;
  };

  const handleImageError = (e, fallbackIndex = 0) => {
    console.log("🖼️ Image failed to load, using fallback");
    e.target.src = fallbackImages[fallbackIndex % fallbackImages.length];
    e.target.onerror = null;
  };

  // Fetch products from database
  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const url = `http://localhost:4000/api/products?page=${page}&limit=8&search=`;
      const res = await axios.get(url);

      console.log("Products fetched for blog:", res.data.products?.length || 0);

      setProducts(res.data.products || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setTotalProducts(res.data.pagination?.totalProducts || 0);
      setCurrentPage(page);
    } catch (err) {
      console.error("Fetch error:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchProducts(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleOrderNow = (product) => {
    if (product.quantity <= 0) {
      alert("Sorry, this product is out of stock!");
      return;
    }
    alert(`🎉 ${product.name} added to cart!\n💰 Price: $${product.price}`);
  };

  // Filter posts by category
  const filteredPosts =
    selectedCategory === "all"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  return (
    <div className="blog-container">
      {/* Header Section */}
      <div className="blog-header text-center py-5">
        <div className="container">
          <h1 className="blog-title">🍔 Sana's Burger Blog</h1>
          <p className="blog-subtitle">
            Stories, Recipes & Our Delicious Burgers
          </p>
          <p className="blog-owner">By Sana Tariq - Owner & Head Chef</p>
        </div>
      </div>

      <div className="container">
        <div className="row">
          {/* Main Content - Blog Posts */}
          <div className="col-lg-8">
            {/* Category Filter */}
            <div className="category-filter mb-4">
              <h4>📝 Blog Categories</h4>
              <div className="filter-buttons">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    className={`filter-btn ${
                      selectedCategory === cat.value ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory(cat.value)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Blog Posts */}
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className={`blog-post ${post.featured ? "featured-post" : ""}`}
              >
                {post.featured && (
                  <div className="featured-badge">Featured</div>
                )}

                <div className="post-header">
                  <h2>{post.title}</h2>
                  <div className="post-meta">
                    <span className="post-date">{post.date}</span>
                    <span className="post-author">By {post.author}</span>
                    <span className="post-category">{post.category}</span>
                  </div>
                </div>

                <div className="post-image">
                  <img
                    src={post.image}
                    alt={post.title}
                    onError={handleImageError}
                  />
                </div>

                <div className="post-content">
                  {post.body.split("\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                <div className="post-tags">
                  {post.tags.map((tag) => (
                    <span key={tag} className="post-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}

            {/* All Products Section */}
            <section className="products-section mt-5">
              <div className="section-header">
                <h2>🍔 Our Delicious Burgers</h2>
                <p>Explore our complete burger collection from the database</p>
              </div>

              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading burgers...</p>
                </div>
              ) : (
                <>
                  {/* Products Grid */}
                  <div className="row">
                    {products.length > 0 ? (
                      products.map((product, index) => (
                        <div className="col-md-6 mb-4" key={product._id}>
                          <div className="card blog-product-card h-100">
                            {/* Product Image */}
                            <div className="product-image-container">
                              <img
                                src={getImageUrl(product.image)}
                                className="card-img-top product-img"
                                alt={product.name}
                                onError={(e) => handleImageError(e, index)}
                              />
                              {product.quantity <= 0 && (
                                <div className="sold-out-badge">SOLD OUT</div>
                              )}
                            </div>

                            {/* Product Details */}
                            <div className="card-body">
                              <h5 className="card-title">{product.name}</h5>
                              <p className="card-price">${product.price}</p>
                              <p className="card-quantity">
                                <span
                                  className={
                                    product.quantity <= 0
                                      ? "text-danger"
                                      : "text-success"
                                  }
                                >
                                  {product.quantity <= 0
                                    ? "Out of Stock"
                                    : `${product.quantity} available`}
                                </span>
                              </p>
                              {product.description && (
                                <p className="card-description">
                                  {product.description}
                                </p>
                              )}

                              <button
                                type="button"
                                className={`btn w-100 order-btn ${
                                  product.quantity <= 0
                                    ? "btn-secondary"
                                    : "btn-danger"
                                }`}
                                onClick={() => handleOrderNow(product)}
                                disabled={product.quantity <= 0}
                              >
                                {product.quantity <= 0
                                  ? "OUT OF STOCK"
                                  : "ORDER NOW 🍔"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-12 text-center py-4">
                        <p className="text-muted">
                          No products available in database
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Pagination for Products */}
                  {totalPages > 1 && (
                    <div className="products-pagination mt-4">
                      <nav aria-label="Products pagination">
                        <ul className="pagination justify-content-center">
                          <li
                            className={`page-item ${
                              currentPage === 1 ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              <i className="fas fa-chevron-left me-1"></i>
                              Previous
                            </button>
                          </li>

                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((page) => (
                            <li
                              key={page}
                              className={`page-item ${
                                currentPage === page ? "active" : ""
                              }`}
                            >
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(page)}
                              >
                                {page}
                              </button>
                            </li>
                          ))}

                          <li
                            className={`page-item ${
                              currentPage === totalPages ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              Next
                              <i className="fas fa-chevron-right ms-1"></i>
                            </button>
                          </li>
                        </ul>
                      </nav>

                      <div className="text-center mt-2">
                        <small className="text-muted">
                          Page {currentPage} of {totalPages} • Showing{" "}
                          {products.length} of {totalProducts} burgers
                        </small>
                      </div>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="blog-sidebar">
              {/* About Sana */}
              <div className="sidebar-widget">
                <h3>About Sana Tariq</h3>
                <div className="owner-info">
                  <img
                    src="/images/owner/sana.jpg"
                    alt="Sana Tariq - Owner"
                    className="owner-image"
                    onError={handleImageError}
                  />
                  <p>
                    Hi! I'm <strong>Sana Tariq</strong>, the proud owner and
                    founder of Burger Boots. Welcome to my burger family!
                  </p>
                </div>
              </div>

              {/* Database Stats */}
              <div className="sidebar-widget">
                <h3>🍔 Burger Stats</h3>
                <div className="stats-info">
                  <div className="stat-item">
                    <strong>Total Burgers:</strong> {totalProducts}
                  </div>
                  <div className="stat-item">
                    <strong>Available Now:</strong>{" "}
                    {products.filter((p) => p.quantity > 0).length}
                  </div>
                  <div className="stat-item">
                    <strong>Categories:</strong>{" "}
                    {new Set(products.map((p) => p.category)).size}
                  </div>
                </div>
              </div>

              {/* Popular Posts */}
              <div className="sidebar-widget">
                <h3>Recent Posts</h3>
                <div className="recent-posts">
                  {blogPosts.slice(0, 3).map((post) => (
                    <div key={post.id} className="recent-post">
                      <h5>{post.title}</h5>
                      <span className="recent-date">{post.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="sidebar-widget">
                <h3>Quick Actions</h3>
                <div className="quick-actions">
                  <Link
                    to="/"
                    className="btn btn-outline-primary btn-sm w-100 mb-2"
                  >
                    🏠 Home Page
                  </Link>
                  <Link
                    to="/add"
                    className="btn btn-outline-success btn-sm w-100 mb-2"
                  >
                    ➕ Add New Burger
                  </Link>
                </div>
              </div>

              {/* Contact Info */}
              <div className="sidebar-widget">
                <h3>Visit Burger Boots</h3>
                <div className="contact-info">
                  <p>
                    <strong>📍 Address:</strong>
                    <br />
                    123 Burger Street, Food City
                  </p>

                  <p>
                    <strong>🕒 Hours:</strong>
                    <br />
                    Mon-Fri: 9AM-10PM
                    <br />
                    Sat-Sun: 10AM-11PM
                  </p>

                  <p>
                    <strong>📞 Phone:</strong>
                    <br />
                    (+92) 673695895
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Products */}
      <div className="text-center py-5">
        <Link to="/" className="btn btn-danger btn-lg">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Blog;
