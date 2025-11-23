import express from "express";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import cors from "cors";
import productRoutes from "./routes/product.route.js";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import blogRoutes from "./routes/blog.route.js";

// Load environment variables
dotenv.config();

const app = express();

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS
app.use(cors({ 
  origin: "http://localhost:3000",
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create 'uploads' folder if it doesn't exist
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log(" 'uploads' folder created automatically.");
}

// Serve uploaded images
app.use("/uploads", express.static(uploadPath));

// Routes
app.use("/api/products", productRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ 
    message: "🍔 Burger Boots API Server is running!",
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use("/api/products", productRoutes);
app.use("/api/blogs", blogRoutes); 

mongoose.set("strictQuery", true);

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/burgerboots";

// Connect to MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    console.log("Please check:");
    console.log("MongoDB is running");
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(' Unhandled Rejection:', err);
  process.exit(1);
});