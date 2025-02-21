import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Validate phone number (10 digits and numbers only)
    if (!/^\d{10}$/.test(phoneNumber)) {
      setMessage("Phone number must be exactly 10 digits.");
      return;
    }

    try {
      // Step 1: Authenticate user with phoneNumber & password
      const loginResponse = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, password }),
      });

      if (!loginResponse.ok) {
        setMessage("Invalid phone number or password");
        return;
      }

      // Step 2: Fetch user details using phone number
      const userResponse = await fetch(`http://localhost:8080/getByPhone?phone=${phoneNumber}`);

      if (!userResponse.ok) {
        setMessage("User details not found");
        return;
      }

      const userData = await userResponse.json();
      localStorage.setItem("user", JSON.stringify(userData)); // Store user details

      setMessage("Login successful!");
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <input
          type="tel"
          placeholder="Phone Number"
          className="login-inputt"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="login-inputt"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-btnn" onClick={handleLogin}>
          Login
        </button>
        <button className="signup-btnn" onClick={() => navigate("/Signup")}>
          Sign Up
        </button>
        {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
