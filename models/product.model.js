import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
    maxlength: [100, "Product name cannot exceed 100 characters"]
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Price cannot be negative"],
    max: [10000, "Price cannot exceed $10,000"]
  },
  quantity: {
    type: Number,
    required: [true, "Product quantity is required"],
    min: [0, "Quantity cannot be negative"],
    default: 0
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters"],
    default: ""
  },
  image: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

// Create index for better search performance
productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model("Product", productSchema);

export default Product;