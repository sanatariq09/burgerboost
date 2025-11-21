import express from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
} from "../controllers/product.controller.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// All products
router.get("/", getProducts);

// Single product
router.get("/:id", getProduct);

// Add product
router.post("/", upload.single("image"), createProduct);

// Update product
router.put("/:id", upload.single("image"), updateProduct);

// Delete product
router.delete("/:id", deleteProduct);

export default router;
