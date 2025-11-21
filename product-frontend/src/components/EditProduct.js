import React, { useEffect, useState } from "react";
import axios from "axios";

function EditProduct({ productId, onClose, onUpdated, onError }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    image: null,
    currentImage: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/products/${productId}`);
        const { name, price, quantity, image } = res.data;
        setFormData({ name, price, quantity, image: null, currentImage: image });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product data:", err);
        setLoading(false);
        if (onError) onError("Failed to fetch product details.");
        else alert("Error fetching product data");
      }
    };
    fetchProduct();
  }, [productId, onError]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("quantity", formData.quantity);
    if (formData.image) data.append("image", formData.image);

    try {
      await axios.put(`http://localhost:4000/api/products/${productId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product updated successfully!");
      if (onUpdated) onUpdated(); // refresh list
      if (onClose) onClose(); // close modal
    } catch (err) {
      console.error("Error updating product:", err.response?.data || err.message);
      if (onError) onError("Failed to update product.");
      else alert("Error updating product");
    }
  };

  if (loading) {
    return <p className="text-center">Loading Categories details...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <div className="mb-3">
        <label className="form-label fw-bold">Name:</label>
        <input
          type="text"
          name="name"
          className="form-control"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Price:</label>
        <input
          type="number"
          name="price"
          className="form-control"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Quantity:</label>
        <input
          type="number"
          name="quantity"
          className="form-control"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Current Image:</label>
        {formData.currentImage ? (
          <img
            src={`http://localhost:4000${formData.currentImage}`}
            alt="current"
            style={{
              width: "100%",
              maxHeight: "200px",
              objectFit: "cover",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          />
        ) : (
          <p className="text-muted">No image available</p>
        )}
        <input
          type="file"
          name="image"
          className="form-control"
          accept="image/*"
          onChange={handleChange}
        />
      </div>

      <div className="d-flex justify-content-between">
        <button type="submit" className="btn btn-success">
          Update
        </button>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default EditProduct;
