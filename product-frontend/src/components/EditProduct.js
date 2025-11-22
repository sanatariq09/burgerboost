import React, { useState, useEffect } from "react";
import axios from "axios";

function EditProduct({ productId, onClose, onSuccess, onError }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    description: ""
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setFetchLoading(true);
      const res = await axios.get(`http://localhost:4000/api/products/${productId}`);
      const product = res.data;
      
      setFormData({
        name: product.name || "",
        price: product.price || "",
        quantity: product.quantity || "",
        description: product.description || ""
      });
    } catch (err) {
      console.error("❌ Fetch product error:", err);
      if (onError) onError("Error loading product");
    } finally {
      setFetchLoading(false);
    }
  };

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
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("price", parseFloat(formData.price));
      submitData.append("quantity", parseInt(formData.quantity));
      submitData.append("description", formData.description);
      
      if (image) {
        submitData.append("image", image);
      }

      await axios.put(`http://localhost:4000/api/products/${productId}`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Product updated successfully");
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (err) {
      console.error("❌ Update product error:", err);
      alert("Error updating product");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading product...</p>
      </div>
    );
  }

  return (
    <div>
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
            Choose a new image to update (optional)
          </div>
        </div>

        <div className="d-flex gap-2 justify-content-end">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-warning"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;