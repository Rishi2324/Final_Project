import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './BusinessVerification.css';


const BusinessVerification = () => {
  const [businessName, setBusinessName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [document, setDocument] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null); // State for verification status
  const [isLoading, setIsLoading] = useState(true); // State for loading indicator
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const phoneNumber = Number(user.phoneNumber); // Ensure it's treated as a number

  // Fetch verification status when the component mounts and update regularly
  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        setIsLoading(true); // Start loading
        const response = await fetch(`http://localhost:8080/status/${phoneNumber}`);
        if (response.ok) {
          const data = await response.json();
          setVerificationStatus(data.status); // Set the status if it exists
        } else {
          setVerificationStatus("Not Found");
        }
      } catch (error) {
        console.error("Error fetching verification status:", error);
        setVerificationStatus("Error fetching status");
      } finally {
        setIsLoading(false); // Stop loading after fetching
      }
    };

    // Poll the verification status every 5 seconds after the component mounts
    const intervalId = setInterval(fetchVerificationStatus, 5000); // Poll every 5 seconds

    // Cleanup the interval when the component is unmounted or if the status is success
    return () => clearInterval(intervalId);
  }, [phoneNumber]);

  // Handle file change for document
  const handleFileChange = (event) => {
    setDocument(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!businessName || !registrationNumber || !businessAddress || !document) {
      alert("Please fill all fields and upload a document.");
      return;
    }

    const formData = new FormData();
    formData.append("phoneNumber", phoneNumber); // Convert to number
    formData.append("businessName", businessName);
    formData.append("registrationNumber", Number(registrationNumber)); // Convert to number
    formData.append("businessAddress", businessAddress);
    formData.append("document", document);

    try {
      const response = await fetch("http://localhost:8080/verify", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Business verification submitted successfully!");
        setVerificationStatus("Pending"); // Set the status to Pending after submission
      } else {
        alert("Failed to submit verification.");
      }
    } catch (error) {
      console.error("Error submitting verification:", error);
      alert("Error submitting verification. Please try again.");
    }
  };

  // Redirect to business dashboard if the verification status becomes success
  useEffect(() => {
    if (verificationStatus === "Success") {
      navigate("/business-dashboard");
    }
  }, [verificationStatus, navigate]);

  return (
    <div className="verification-container">
      <h2>Business Verification</h2>

      {/* Show loading message while fetching status */}
      {isLoading ? (
        <div className="loading-indicator">Loading verification status...</div>
      ) : (
        <div>
          {/* Display the current verification status */}
          {verificationStatus && (
            <h3>Verification Status: {verificationStatus}</h3>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label>Business Name:</label>
        <div className="mee">
        <input
        placeholder="Business Name"
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
        /></div>

        <label>Registration Number:</label>
        <input
        className="mee"
        placeholder="Registration Number"
          type="number"
          value={registrationNumber}
          onChange={(e) => setRegistrationNumber(e.target.value)}
          required
        />

        <label>Business Address:</label>
        <input
        placeholder="Business Address"
          type="text"
          value={businessAddress}
          onChange={(e) => setBusinessAddress(e.target.value)}
          required
        />

        <label>Upload Business Document:</label>
        <input type="file" onChange={handleFileChange} required />

        <button type="submit">Submit Verification</button>
      </form>
    </div>
  );
};

export default BusinessVerification;
