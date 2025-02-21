import React from "react";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome

const PatientSidebar = () => {
  return (
    <div className="sidebar">
      <h2>MedSync</h2>
      <ul>
        <li>
          <Link to="/Dashboard">
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/doctors">
            <i className="fas fa-user-md"></i> Consultations
          </Link>
        </li>
        <li>
          <Link to="/appointment">
            <i className="fas fa-calendar-alt"></i> Appointments
          </Link>
        </li>
        <li>
          <Link to="/notifications">
            <i className="fas fa-bell"></i> Notifications
          </Link>
        </li>
        <li>
          {/* <Link to="/chatbot">
            <i className="fas fa-robot"></i> AI Chatbot
          </Link> */}
          <a href="http://127.0.0.1:5000/">
            <i className="fas fa-robot"></i> AI Chatbot
          </a>
        </li>
      </ul>
    </div>
  );
};

export default PatientSidebar;
