import React, { useEffect, useState } from "react";
import axios from "axios";
import EditProduct from "./EditProduct";
import "./ProductList.css";
import Slider from "react-slick";

const sliderImages = [
  "/images/slider/burger.jpg",
  "/images/slider/burger1.jpg", 
  "/images/slider/burger2.jpg",
  "/images/slider/burger3.jpg",
  "/images/slider/burger4.jpg"
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

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editError, setEditError] = useState(null);
  
  // Pagination & Search here
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  
  // Checkout state here
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderDetails, setOrderDetails] = useState({
    quantity: 1,
    customerName: "",
    phone: "",
    address: "",
    specialInstructions: ""
  });

  const fetchProducts = async (page = 1, search = "") => {
    try {
      setLoading(true);
      
      const url = `http://localhost:4000/api/products?page=${page}&limit=6&search=${encodeURIComponent(search)}`;
      console.log("Fetching:", url);
      
      const res = await axios.get(url);
      
      setProducts(res.data.products || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setTotalProducts(res.data.pagination?.totalProducts || 0);
      setCurrentPage(page);
      setSearchTerm(search);
      setLoading(false);
    } catch (err) {
      console.error("Fetch products error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1, "");
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchProducts(1, searchInput.trim());
    } else {
      fetchProducts(1, "");
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    fetchProducts(1, "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/products/${id}`);
      fetchProducts(currentPage, searchTerm);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting product");
    }
  };

  const openEditor = (id) => {
    setEditError(null);
    setEditingId(id);
  };

  // Order Now Button
  const handleOrderNow = (product) => {
    setSelectedProduct(product);
    setOrderDetails({
      quantity: 1,
      customerName: "",
      phone: "",
      address: "",
      specialInstructions: ""
    });
    setShowCheckout(true);
  };

  // Close Checkout
  const handleCloseCheckout = () => {
    setShowCheckout(false);
    setSelectedProduct(null);
  };

  // Handle order form changes
  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit Order
  const handleSubmitOrder = (e) => {
    e.preventDefault();
    
    if (!orderDetails.customerName || !orderDetails.phone || !orderDetails.address) {
      alert("Please fill all required fields");
      return;
    }

    // Calculate total price
    const totalPrice = selectedProduct.price * orderDetails.quantity;

    const orderData = {
      productId: selectedProduct._id,
      productName: selectedProduct.name,
      quantity: orderDetails.quantity,
      unitPrice: selectedProduct.price,
      totalPrice: totalPrice,
      customerName: orderDetails.customerName,
      phone: orderDetails.phone,
      address: orderDetails.address,
      specialInstructions: orderDetails.specialInstructions,
      orderDate: new Date().toISOString()
    };

    console.log("Order Submitted:", orderData);
    
    // Success message
    alert(`Order Placed Successfully!\n\nProduct: ${selectedProduct.name}\nQuantity: ${orderDetails.quantity}\nTotal: $${totalPrice}\n\nThank you for your order!`);
    
    // Close checkout
    handleCloseCheckout();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchProducts(newPage, searchTerm);
    }
  };

  // Generate page numbers
  const renderPageNumbers = () => {
    const pages = [];
    
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
          <button
            className="page-link"
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        </li>
      );
    }
    return pages;
  };

  if (loading) return <p className="text-center">Loading products...</p>;

  return (
    <div className="container my-4">
      {/* Slider */}
      <div className="mb-4 slider-container">
        <Slider {...settings}>
          {sliderImages.map((img, i) => (
            <div key={i}>
              <img src={img} alt={`Slide ${i}`} className="slider-img" />
            </div>
          ))}
        </Slider>
      </div>
      
      <h3 className="text-center mb-4">All Products</h3>
      
      {/* Search Bar */}
      <div className="row mb-4">
        <div className="col-md-8 mx-auto">
          <form onSubmit={handleSearch} className="d-flex gap-2">
            <div className="flex-grow-1">
              <input
                type="text"
                className="form-control"
                placeholder="Search exact product name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
            {searchTerm && (
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleClearSearch}
              >
                Clear
              </button>
            )}
          </form>
          <small className="text-muted mt-1 d-block text-center">
            {searchTerm 
              ? "Showing exact matches only" 
              : "Showing all products with pagination"
            }
          </small>
        </div>
      </div>

      {/* Results Info */}
      <div className="row mb-3">
        <div className="col text-center">
          <p className="text-muted">
            {searchTerm ? (
              <>
                <span className="badge bg-info me-2">EXACT SEARCH</span>
                Results for "<strong>{searchTerm}</strong>"
              </>
            ) : (
              <>
                <span className="badge bg-success me-2">ALL PRODUCTS</span>
                Page {currentPage} of {totalPages}
              </>
            )}
            {" | "}Showing {products.length} of {totalProducts} products
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="row">
        {products.map((p) => (
          <div className="col-md-6 col-lg-4 mb-4" key={p._id}>
            <div className="card product-card h-100 shadow-sm">
              {p.image && (
                <img
                  src={`http://localhost:4000${p.image}`}
                  className="card-img-top product-img"
                  alt={p.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">
                  <strong>Price:</strong> ${p.price}
                </p>
                {p.quantity && (
                  <p className="card-text">
                    <strong>Available:</strong> {p.quantity}
                  </p>
                )}
                
                {/* Order Now Button */}
                <div className="mt-2 mb-3">
                  <button
                    type="button"
                    className="btn btn-danger w-100 order-now-btn"
                    onClick={() => handleOrderNow(p)}
                  >
                    <strong>ORDER NOW</strong>
                  </button>
                </div>

                <div className="mt-auto d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-warning btn-sm"
                    onClick={() => openEditor(p._id)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Exact Match Message */}
      {searchTerm && products.length > 0 && (
        <div className="alert alert-info text-center">
          🔍 <strong>Exact Match Found!</strong> Showing {products.length} product(s) for "{searchTerm}"
        </div>
      )}

      {/* No Products Message */}
      {products.length === 0 && !loading && (
        <div className="text-center py-4">
          <p className="text-muted">
            {searchTerm 
              ? `No exact match found for "${searchTerm}"`
              : "No products available"
            }
          </p>
          {searchTerm && (
            <button 
              className="btn btn-primary mt-2"
              onClick={handleClearSearch}
            >
              Show All categories
            </button>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <nav aria-label="Page navigation">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &laquo;
                </button>
              </li>
              {renderPageNumbers()}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  &raquo;
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

     {/* Checkout Modal */}
{showCheckout && selectedProduct && (
  <div className="modal-overlay show" onClick={handleCloseCheckout}>
    <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
      <div className="modal-content">
        {/* checkout */}
        <div className="modal-header bg-primary text-white">
          <h5 className="modal-title">
            🛒 Checkout - {selectedProduct.name}
          </h5>
          <button type="button" className="btn-close btn-close-white" onClick={handleCloseCheckout}></button>
        </div>
        <div className="modal-body">
          <div className="row">
            {/* Product Summary */}
            <div className="col-md-6">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-light">
                  <h6 className="mb-0">📦 Order Summary</h6>
                </div>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    {selectedProduct.image && (
                      <img
                        src={`http://localhost:4000${selectedProduct.image}`}
                        alt={selectedProduct.name}
                        className="me-3"
                        style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
                      />
                    )}
                    <div>
                      <h6 className="mb-1">{selectedProduct.name}</h6>
                      <p className="text-muted mb-0">${selectedProduct.price} each</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      <strong>Quantity</strong>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="quantity"
                      value={orderDetails.quantity}
                      onChange={handleOrderChange}
                      min="1"
                      max={selectedProduct.quantity || 50}
                    />
                  </div>
                  <div className="border-top pt-3">
                    <div className="d-flex justify-content-between">
                      <strong>Total Amount:</strong>
                      <strong className="text-danger" style={{ fontSize: '1.2rem' }}>
                        ${(selectedProduct.price * orderDetails.quantity).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="col-md-6">
              <form onSubmit={handleSubmitOrder}>
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-light">
                    <h6 className="mb-0">👤 Customer Details</h6>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">
                        <strong>Full Name *</strong>
                      </label>
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
                      <label className="form-label">
                        <strong>Phone Number *</strong>
                      </label>
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
                        <strong>Delivery Address *</strong>
                      </label>
                      <textarea
                        className="form-control"
                        name="address"
                        value={orderDetails.address}
                        onChange={handleOrderChange}
                        required
                        rows="3"
                        placeholder="Enter your complete address"
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">
                        <strong>Special Instructions</strong>
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
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={handleCloseCheckout}>
            Cancel
          </button>
          <button type="button" className="btn btn-success" onClick={handleSubmitOrder}>
            Place Order - ${(selectedProduct.price * orderDetails.quantity).toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
      {/* Edit Modal */}
      {editingId && (
        <div className="modal-overlay show" onClick={() => setEditingId(null)}>
          <div className="modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-card p-3">
              <div className="modal-header d-flex justify-content-between align-items-center">
                <h5 className="modal-title">Edit Product</h5>
                <button className="btn-close" onClick={() => setEditingId(null)} />
              </div>

              <div className="modal-body">
                {editError ? (
                  <div className="alert alert-danger">Error loading editor: {editError}</div>
                ) : (
                  <EditProduct
                    productId={editingId}
                    onClose={() => setEditingId(null)}
                    onUpdated={() => {
                      fetchProducts(currentPage, searchTerm);
                      setEditingId(null);
                    }}
                    onError={(msg) => {
                      console.error("EditProduct error:", msg);
                      setEditError(msg || "Unknown error");
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;