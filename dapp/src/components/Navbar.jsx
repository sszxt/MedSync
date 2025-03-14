import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleLogout = () => {
    // Clear authentication tokens or user data if needed
    console.log("User logged out");

    // Redirect to login page
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h1>Dashboard</h1>
      <div className="user-info">
        <span>Hello, </span>
        <div className="profile-circle">
          <img src="/public/AAKIF.jpg" alt="Profile" className="profile-img" />
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
