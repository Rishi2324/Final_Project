import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import Login from "./Login";
import BusinessVerification from "./BusinessVerification";
import BusinessDashboard from "./BusinessDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/BusinessVerification" element={<BusinessVerification />} />
        <Route path="/BusinessDashboard" element={<BusinessDashboard />} />
        <Route path="*" element={<Login />} /> {/* Default to Login */}
      </Routes>
    </Router>
  );
};

export default App;
