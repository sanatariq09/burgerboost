import React, { useEffect, useState } from "react";
import axios from "axios";
import EditProduct from "./EditProduct";
import "./ProductList.css";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";

const sliderImages = [
  "/images/slider/burger.jpg",
  "/images/slider/burger2.jpg",
  "/images/slider/burger3.jpg",
  "/images/slider/burger4.jpg",
];

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

function ProductList({ refreshTrigger }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editError, setEditError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderDetails, setOrderDetails] = useState({
    quantity: 1,
    customerName: "",
    phone: "",
    address: "",
    specialInstructions: "",
  });

  const navigate = useNavigate();

  const fetchProducts = async (page = 1, search = "") => {
    try {
      setLoading(true);
      console.log(" Fetching products...", { page, search });

      const url = `http://localhost:4000/api/products?page=${page}&limit=6&search=${encodeURIComponent(
        search
      )}`;
      const res = await axios.get(url);

      console.log(
        "Products fetched successfully:",
        res.data.products?.length || 0
      );

      setProducts(res.data.products || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setTotalProducts(res.data.pagination?.totalProducts || 0);
      setCurrentPage(page);
      setSearchTerm(search);
    } catch (err) {
      console.error("Fetch error:", err);
      setProducts([]);
      setTotalPages(1);
      setTotalProducts(0);
      alert("Error fetching products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect 
  useEffect(() => {
    console.log("Refresh trigger changed:", refreshTrigger);
    fetchProducts(1, "");
  }, [refreshTrigger]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(1, searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput("");
    fetchProducts(1, "");
  };

  // Handle delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(`http://localhost:4000/api/products/${id}`);
      alert("Product deleted successfully!");
      fetchProducts(currentPage, searchTerm);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting product");
    }
  };

  // Edit product functions
  const openEditor = (id) => {
    setEditError(null);
    setEditingId(id);
  };

  const closeEditor = () => {
    setEditingId(null);
    setEditError(null);
  };

  const handleEditSuccess = () => {
    fetchProducts(currentPage, searchTerm);
    closeEditor();
    alert("Product updated successfully!");
  };

  // Order functions
  const handleOrderNow = (product) => {
    if (product.quantity <= 0) {
      alert("Sorry, this product is out of stock!");
      return;
    }
    setSelectedProduct(product);
    setOrderDetails({
      quantity: 1,
      customerName: "",
      phone: "",
      address: "",
      specialInstructions: "",
    });
    setShowCheckout(true);
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
    setSelectedProduct(null);
  };

  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();

    // Validation
    if (!orderDetails.customerName.trim()) {
      alert("Please enter your name");
      return;
    }
    if (!orderDetails.phone.trim()) {
      alert("Please enter your phone number");
      return;
    }
    if (!orderDetails.address.trim()) {
      alert("Please enter your delivery address");
      return;
    }
    if (orderDetails.quantity < 1) {
      alert("Please enter a valid quantity");
      return;
    }
    if (selectedProduct && orderDetails.quantity > selectedProduct.quantity) {
      alert(`Only ${selectedProduct.quantity} items available in stock`);
      return;
    }

    const totalPrice = selectedProduct.price * orderDetails.quantity;

    // Create order summary
    const orderSummary = `
      🎉 Order Placed Successfully!
      
      📦 Product: ${selectedProduct.name}
      🔢 Quantity: ${orderDetails.quantity}
      💰 Total: $${totalPrice.toFixed(2)}
      👤 Customer: ${orderDetails.customerName}
      📞 Phone: ${orderDetails.phone}
      🏠 Address: ${orderDetails.address}
      ${
        orderDetails.specialInstructions
          ? `📝 Instructions: ${orderDetails.specialInstructions}`
          : ""
      }
      
      Thank you for your order! Your delicious burger will be delivered soon. 🍔
    `;

    alert(orderSummary);
    handleCloseCheckout();
  };

  // Pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchProducts(newPage, searchTerm);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container my-4">
        <div className="text-center py-5">
          <div
            className="spinner-border text-primary"
            style={{ width: "3rem", height: "3rem" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 fs-5 text-muted">
            Loading delicious burgers... 🍔
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      {/* Add Product Button */}
      <div className="row mb-4">
        <div className="col text-end">
          <button
            className="btn btn-success btn-lg"
            onClick={() => navigate("/add")}
          >
            <i className="fas fa-plus me-2 .modal-header.bg-warning"></i>
            Add New Product
          </button>
        </div>
      </div>

      {/* Image Slider */}
      <div className="mb-4 slider-container">
        <Slider {...settings}>
          {sliderImages.map((img, i) => (
            <div key={i}>
              <img
                src={img}
                alt={`Delicious Burger ${i + 1}`}
                className="slider-img"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/800x400/FF6B6B/FFFFFF?text=Delicious+Burger";
                }}
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Page Title */}
      <h3 className="text-center mb-4 text-primary">
        🍔 Our Delicious Burgers
      </h3>

      {/* Search Bar */}
      <div className="row mb-4">
        <div className="col-md-8 mx-auto">
          <form onSubmit={handleSearch} className="d-flex gap-2">
            <div className="flex-grow-1 position-relative">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="🔍 Search burgers by name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg px-4">
              Search
            </button>
            {searchTerm && (
              <button
                type="button"
                className="btn btn-outline-secondary btn-lg"
                onClick={handleClearSearch}
              >
                Clear
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Products Count */}
      <div className="row mb-3">
        <div className="col text-center">
          <p className="text-muted fs-5">
            {searchTerm
              ? `🔍 Search results for "${searchTerm}"`
              : "📦 All Products"}{" "}
            - Showing <strong>{products.length}</strong> of{" "}
            <strong>{totalProducts}</strong> burgers
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="row">
        {products.length > 0 ? (
          products.map((product) => (
            <div className="col-md-6 col-lg-4 mb-4" key={product._id}>
              <div className="card product-card h-100 shadow-sm border-0">
                {/* Product Image */}
                {product.image && (
                  <div className="product-image-container">
                    <img
                      src={`http://localhost:4000${product.image}`}
                      className="card-img-top product-img"
                      alt={product.name}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Burger+Image";
                      }}
                    />
                    {product.quantity <= 0 && (
                      <div className="sold-out-badge">SOLD OUT</div>
                    )}
                  </div>
                )}

                {/* Product Details */}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-dark">{product.name}</h5>
                  <p className="card-text">
                    <strong>💰 Price:</strong> ${product.price}
                  </p>
                  <p className="card-text">
                    <strong>📦 Available:</strong>
                    <span
                      className={
                        product.quantity <= 0 ? "text-danger" : "text-success"
                      }
                    >
                      {product.quantity <= 0
                        ? " Out of Stock"
                        : ` ${product.quantity}`}
                    </span>
                  </p>
                  {product.description && (
                    <p className="card-text text-muted small">
                      {product.description}
                    </p>
                  )}

                  {/* Order Now Button */}
                  <div className="mt-2 mb-3">
                    <button
                      type="button"
                      className={`btn w-100 order-now-btn ${
                        product.quantity <= 0 ? "btn-secondary" : "btn-danger"
                      }`}
                      onClick={() => handleOrderNow(product)}
                      disabled={product.quantity <= 0}
                    >
                      <strong>
                        {product.quantity <= 0
                          ? "OUT OF STOCK"
                          : "ORDER NOW 🍔"}
                      </strong>
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto d-flex justify-content-between gap-2">
                    <button
                      type="button"
                      className="btn btn-warning btn-sm flex-fill"
                      onClick={() => openEditor(product._id)}
                    >
                      <i className="fas fa-edit me-1"></i>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm flex-fill"
                      onClick={() => handleDelete(product._id)}
                    >
                      <i className="fas fa-trash me-1"></i>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          /* No Products Found */
          <div className="col-12 text-center py-5">
            <div className="empty-state">
              <i className="fas fa-hamburger fa-4x text-muted mb-3"></i>
              <h4 className="text-muted">No burgers found</h4>
              <p className="text-muted mb-4">
                {searchTerm
                  ? `No products found for "${searchTerm}"`
                  : "No products available yet"}
              </p>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate("/add")}
              >
                <i className="fas fa-plus me-2"></i>
                Add Your First Burger
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-5">
          <nav aria-label="Products pagination">
            <ul className="pagination">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
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

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
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
                )
              )}

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
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && selectedProduct && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="fas fa-shopping-cart me-2"></i>
                  Checkout - {selectedProduct.name}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseCheckout}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  {/* Order Summary */}
                  <div className="col-md-6">
                    <div className="card h-100">
                      <div className="card-header bg-light">
                        <h6 className="mb-0">
                          <i className="fas fa-receipt me-2"></i>Order Summary
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="d-flex align-items-center mb-3">
                          {selectedProduct.image && (
                            <img
                              src={`http://localhost:4000${selectedProduct.image}`}
                              alt={selectedProduct.name}
                              className="me-3 rounded"
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                              }}
                            />
                          )}
                          <div>
                            <h6 className="mb-1">{selectedProduct.name}</h6>
                            <p className="text-muted mb-0">
                              ${selectedProduct.price} each
                            </p>
                            <small className="text-success">
                              In stock: {selectedProduct.quantity}
                            </small>
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label fw-bold">Quantity</label>
                          <input
                            type="number"
                            className="form-control"
                            name="quantity"
                            value={orderDetails.quantity}
                            onChange={handleOrderChange}
                            min="1"
                            max={selectedProduct.quantity}
                          />
                        </div>
                        <div className="border-top pt-3">
                          <div className="d-flex justify-content-between fw-bold fs-5">
                            <span>Total Amount:</span>
                            <span className="text-danger">
                              $
                              {(
                                selectedProduct.price * orderDetails.quantity
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="col-md-6">
                    <div className="card h-100">
                      <div className="card-header bg-light">
                        <h6 className="mb-0">
                          <i className="fas fa-user me-2"></i>Customer Details
                        </h6>
                      </div>
                      <div className="card-body">
                        <form onSubmit={handleSubmitOrder}>
                          <div className="mb-3">
                            <label className="form-label">Full Name *</label>
                            <input
                              type="text"
                              className="form-control"
                              name="customerName"
                              value={orderDetails.customerName}
                              onChange={handleOrderChange}
                              required
                              placeholder="Enter your full name"
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Phone Number *</label>
                            <input
                              type="tel"
                              className="form-control"
                              name="phone"
                              value={orderDetails.phone}
                              onChange={handleOrderChange}
                              required
                              placeholder="Enter your phone number"
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">
                              Delivery Address *
                            </label>
                            <textarea
                              className="form-control"
                              name="address"
                              value={orderDetails.address}
                              onChange={handleOrderChange}
                              required
                              rows="3"
                              placeholder="Enter your complete delivery address"
                            ></textarea>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">
                              Special Instructions
                            </label>
                            <textarea
                              className="form-control"
                              name="specialInstructions"
                              value={orderDetails.specialInstructions}
                              onChange={handleOrderChange}
                              rows="2"
                              placeholder="Any special instructions for your order..."
                            ></textarea>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseCheckout}
                >
                  <i className="fas fa-times me-1"></i>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-success btn-lg"
                  onClick={handleSubmitOrder}
                >
                  <i className="fas fa-check me-1"></i>
                  Place Order - $
                  {(selectedProduct.price * orderDetails.quantity).toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingId && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(250, 246, 246, 0.95)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title">
                  <i className="fas fa-edit me-2"></i>
                  Edit Product
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeEditor}
                ></button>
              </div>
              <div className="modal-body">
                {editError && (
                  <div className="alert alert-danger">{editError}</div>
                )}
                <EditProduct
                  productId={editingId}
                  onClose={closeEditor}
                  onSuccess={handleEditSuccess}
                  onError={(error) => setEditError(error)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;
