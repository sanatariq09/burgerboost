import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddProduct from "./components/AddProduct";
import ProductList from "./components/ProductList";
import Blog from "./components/Blog";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleProductAdded = () => {
    console.log("🔄 Refreshing product list...");
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
          <Link className="navbar-brand" to="/">🍔 BURGER BOOTS</Link>
          <div>
            <Link className="btn btn-outline-light mx-2" to="/">
              📦 All Products
            </Link>
            <Link className="btn btn-outline-light mx-2" to="/blog">
              📝 Blog
            </Link>
          </div>
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route 
            path="/" 
            element={<ProductList refreshTrigger={refreshTrigger} />} 
          />
          <Route 
            path="/add" 
            element={<AddProduct onProductAdded={handleProductAdded} />} 
          />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;