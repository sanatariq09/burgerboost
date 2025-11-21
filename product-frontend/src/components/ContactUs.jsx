import React, { useState } from "react";
import "./ContactUs.css";

function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all fields");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="contact-container">
      <div className="contact-card shadow">
        <h2 className="text-center mb-3 text-primary">Contact Us</h2>

        {submitted ? (
          <div className="alert alert-success text-center">
            Thank you! Your message was sent.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="form-control"
                rows="5"
              />
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary px-4">
                Send Message
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ContactUs;
