import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddProduct from "./components/AddProduct";
import ProductList from "./components/ProductList";
import ContactUs from "./components/ContactUs"; 
import "./bootstrap.min.css";

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
          <Link className="navbar-brand" to="/">BURGER BOOTS</Link>
          <div>
            <Link className="btn btn-outline-light mx-2" to="/">All Categories</Link>
            <Link className="btn btn-outline-light mx-2" to="/add">Add Categories</Link>
            <Link className="btn btn-outline-light" to="/contact">Contact Us</Link>
          </div>
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/add" element={<AddProduct />} />
          <Route path="/contact" element={<ContactUs />} /> {/*route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
