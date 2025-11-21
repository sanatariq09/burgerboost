import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: String,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Add pagination plugin to schema
ProductSchema.plugin(mongoosePaginate);

const Product = mongoose.model("Product", ProductSchema);
export default Product;