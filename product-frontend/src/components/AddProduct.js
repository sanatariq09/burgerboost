import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddProduct({ onProductAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    description: ""
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.quantity) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("price", parseFloat(formData.price));
      submitData.append("quantity", parseInt(formData.quantity));
      submitData.append("description", formData.description);
      
      if (image) {
        submitData.append("image", image);
      }

      const res = await axios.post("http://localhost:4000/api/products", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Product added:", res.data);
      
      // Reset form
      setFormData({
        name: "",
        price: "",
        quantity: "",
        description: ""
      });
      setImage(null);
      
      // Notify parent component
      if (onProductAdded) {
        onProductAdded();
      }
      
      alert("Product added successfully!");
      navigate("/");

    } catch (err) {
      console.error("❌ Add product error:", err);
      setError(err.response?.data?.message || "Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-danger  text-white">
              <h4 className="mb-0">➕ Add New Product</h4>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger">{error}</div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter product name"
                  />
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Price ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Quantity *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Enter product description"
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">Product Image</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <div className="form-text">
                    Upload a product image (optional)
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Product"}
                  </button>
                  
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/")}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;