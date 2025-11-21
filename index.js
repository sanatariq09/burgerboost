import express from "express";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import productRoutes from "./routes/product.route.js";
import cors from "cors";

const app = express();

//CORS
app.use(cors());

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Create 'uploads' 
const uploadPath = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
  console.log("'uploads' folder created automatically.");
}

//Serve uploaded images
app.use("/uploads", express.static(uploadPath));

// Routes
app.use("/api/products", productRoutes);

//Test route
app.get("/", (req, res) => {
  res.send("Hello from Node API Server — updated!");
});

//Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://sanatarique17:Karachi%40123@backenddb.8atvt8z.mongodb.net/Node-API?appName=BackendDB",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(4000, () => console.log("Server running on port 4000"));
  })
  .catch((err) => console.error("Connection error:", err));
