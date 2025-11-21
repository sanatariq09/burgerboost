import React, { useState } from "react";
import axios from "axios";

function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    image: null,
  });

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("quantity", formData.quantity);
    data.append("image", formData.image);

    try {
      await axios.post("http://localhost:4000/api/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Product added successfully!");
    } catch (err) {
      console.error(err);
      alert("Error adding product");
    }
  };

  return (
    <div className="card p-4 shadow">
      <h3 className="mb-4 text-center">Add New Categoriy</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name:</label>
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
          <label>Price:</label>
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
          <label>Quantity:</label>
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
          <label>Product Image:</label>
          <input
            type="file"
            name="image"
            className="form-control"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
