import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import "./Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState({ name: "", phoneNumber: "", email: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser({ ...storedUser });
      fetchUploadedFiles(storedUser.phoneNumber);
      fetchVerificationStatus(storedUser.phoneNumber);
    } else {
      navigate("/login");
    }

    const storedPrivacy = localStorage.getItem("isPrivate");
    if (storedPrivacy !== null) {
      setIsPrivate(JSON.parse(storedPrivacy));
    }
  }, [navigate]);

  const fetchUploadedFiles = async (phoneNumber) => {
    try {
      const response = await fetch(`http://localhost:8080/files/${phoneNumber}`);
      if (response.ok) {
        const files = await response.json();
        setUploadedFiles(files);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const fetchVerificationStatus = async (phoneNumber) => {
    try {
      const response = await fetch(`http://localhost:8080/status/${phoneNumber}`);
      if (response.ok) {
        const data = await response.json();
        setVerificationStatus(data.status);
      }
    } catch (error) {
      console.error("Error fetching verification status:", error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const filename = `${user.phoneNumber}_${selectedFile.name}`;
    const newFile = new File([selectedFile], filename, { type: selectedFile.type });

    const formData = new FormData();
    formData.append("file", newFile);

    try {
      const response = await fetch("http://localhost:8080/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully!");
        setSelectedFile(null);
        fetchUploadedFiles(user.phoneNumber);
      } else {
        alert("File upload failed!");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file!");
    }
  };

  const handleDelete = async (filename) => {
    try {
      const response = await fetch(`http://localhost:8080/delete/${user.phoneNumber}/${filename}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("File deleted successfully!");
        setUploadedFiles(uploadedFiles.filter(file => file !== filename));
      } else {
        alert("Failed to delete the file.");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Error deleting file!");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/logout", { method: "POST", credentials: "include" });
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const togglePrivacy = async () => {
    const updatedPrivacy = !isPrivate;
    try {
      const response = await fetch(`http://localhost:8080/updatePrivacy?phoneNumber=${user.phoneNumber}&isPrivate=${updatedPrivacy}`, {
        method: "PUT",
      });

      if (response.ok) {
        setIsPrivate(updatedPrivacy);
        localStorage.setItem("isPrivate", JSON.stringify(updatedPrivacy));
      } else {
        console.error("Failed to update privacy setting");
      }
    } catch (error) {
      console.error("Error updating privacy setting:", error);
    }
  };
  // Function for switching business (if needed)
const handleSwitchBusiness = async () => {
  if (verificationStatus !== null) {
    if (verificationStatus === "Success") {
      navigate("/BusinessDashboard"); // Redirect to business dashboard if verified
    } else if (verificationStatus === "Pending") {
      navigate("/BusinessVerification"); // Stay on business verification page if pending
    }
  } else {
    // If the user hasn't submitted their verification details yet (no verification status found)
    navigate("/BusinessVerification"); // Navigate to business verification page
  }
};


  return (
    <div className="dashboard-t">
    <div className="dashboard">
      <div className="header">
        <button className="custom-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="privacy-toggle">
        <label className="switch">
          <input type="checkbox" checked={isPrivate} onChange={togglePrivacy} />
          <span className="slider"></span>
        </label>
        <span className="privacy-status">{isPrivate ? "Private" : "Public"}</span>
      </div>

      <div className="user-profile">
        <h3>User Profile</h3>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <div className="file-actions">
        <input type="file" id="file-upload" onChange={handleFileChange} />
        <button className="upload-btn" onClick={handleUpload}>Upload</button>
      </div>

      <div className="uploaded-files">
        <h3>Uploaded Files</h3>
        <ul>
          {uploadedFiles.length > 0 ? (
            uploadedFiles.map((file, index) => (
              <li key={index}>
                {file}
                <button className="delete-button" onClick={() => handleDelete(file)}>Delete</button>
              </li>
            ))
          ) : (
            <p>No files uploaded yet.</p>
          )}
        </ul>
      </div>

      <button className="business-btn" onClick={handleSwitchBusiness}>Switch Business</button>
    </div>
    </div>
  );
};

export default Dashboard;
