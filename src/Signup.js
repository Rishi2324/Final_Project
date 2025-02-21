import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css"; // Import CSS file

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number (must be exactly 10 digits)
    if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      setErrorMessage("Phone number must be exactly 10 digits.");
      return;
    }
    
    setErrorMessage(""); // Clear previous error messages

    try {
      const response = await fetch("http://localhost:8080/Add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage("Signup Successful! Redirecting to Login...");
        setTimeout(() => navigate("/login"), 1000);
      } else {
        setSuccessMessage("Already registered! Please login.");
      }
    } catch (error) {
      console.error("Error:", error);
      setSuccessMessage("Something went wrong!");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-title">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="signup-input"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="signup-input"
            required
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="signup-input"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="signup-input"
            autoComplete="off"
            required
          />
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
        
        {/* Display error or success message */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        
        <button onClick={() => navigate("/login")} className="login-btn">
          Login
        </button>
      </div>
    </div>
  );
};

export default Signup;
