import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import './BusinessDashboard.css';  // Ensure this path is correct


const BusinessDashboard = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Initialize navigation

  // Handle phone number change
  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Fetch privacy status before fetching files
  const fetchFiles = async () => {
    if (!phoneNumber) {
      alert("Please enter a phone number");
      return;
    }

    // Validate phone number (must be 10 digits)
    if (phoneNumber.length !== 10 || isNaN(phoneNumber)) {
      alert("Check phone number format");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Check user's privacy setting first
      const privacyResponse = await fetch(`http://localhost:8080/checkAccess?phoneNumber=${phoneNumber}`);
      if (!privacyResponse.ok) {
        if (privacyResponse.status === 403) {
          alert("User has set their files to private.");
          setLoading(false);
          return;
        }
        throw new Error("Failed to check privacy status");
      }

      // If public, fetch files
      const response = await fetch(`http://localhost:8080/files/${phoneNumber}`);
      if (response.ok) {
        const data = await response.json();
        if (data.length === 0) {
          setError("User not uploaded files");
          setFiles([]);
        } else {
          setFiles(data);
        }
      } else {
        setError("Error fetching files. Please try again. check phone number");
        setFiles([]);
      }
    } catch (error) {
      setError("Error fetching files. Please try again. check phone number");
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter files based on search term
  const filteredFiles = files.filter((file) =>
    file.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle file selection
  const handleFileSelection = (file, isSelected) => {
    if (isSelected) {
      setSelectedFiles([...selectedFiles, file]);
    } else {
      setSelectedFiles(selectedFiles.filter((selectedFile) => selectedFile !== file));
    }
  };

  // Download selected files
  const handleDownload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select files to download.");
      return;
    }

    for (const file of selectedFiles) {
      try {
        const response = await fetch(`http://localhost:8080/download/${file}`);

        if (!response.ok) {
          throw new Error(`Failed to download: ${file}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Create an anchor tag to trigger download
        const link = document.createElement("a");
        link.href = url;
        link.download = file;
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        alert(`Error downloading ${file}: ${error.message}`);
      }
    }
  };

  // Function to switch to user dashboard
  const handleSwitchToUser = () => {
    navigate("/dashboard"); // Navigate to Dashboard
  };

  return (
    <div className="business-dashboard">
      <h1>Business Dashboard</h1>

      {/* Card for Switching to User */}
      <div className="card switch-card">
        <button onClick={handleSwitchToUser} className="switch-to-user">
          Switch to User
        </button>
      </div>

      {/* Card for Phone Number Input */}
      <div className="card">
     <h3><label className="enter">Enter Phone Number:</label></h3> 
       <div className="ph">
        <input
          type="text"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder="Enter phone number"
        />
        </div>

        <button onClick={fetchFiles} disabled={loading} className="custom-btnn">
          {loading ? "Loading..." : "Get Files"}
        </button>
      </div>

      {/* Error Message Card */}
      {error && (
        <div className="card error-card">
          <p>{error}</p>
        </div>
      )}

      {/* Search and File List Card */}
      {files.length > 0 && (
        <div className="card file-list-card">
          <div className="nnn">
         
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search files"
          />
          </div>
          <div className="mmm">
          <h3>Uploaded Files</h3>
          <ul>
            {filteredFiles.map((file, index) => (
              <li key={index}>
                <input
                  type="checkbox"
                  id={`file-${index}`}
                  onChange={(e) => handleFileSelection(file, e.target.checked)}
                />
                <label htmlFor={`file-${index}`}>{file}</label>
              </li>
            ))}
          </ul>
          </div>
       
          <button onClick={handleDownload} className="download-btn">
            Download Selected Files
          </button>
         
        </div>
      )}
    </div>
  );
};

export default BusinessDashboard;
