import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {

  const navigate = useNavigate()

  useEffect(()=>{
    const timer = setTimeout(() => {
      navigate("/login")
    }, 4000);

    return()=>{
      clearTimeout(timer)
    }
  },[navigate])
  return (
    <div className="welcome-container body-home">
      <div className="welcome-message">Welcome to HealthCare Hub</div>
      <div className="tagline">Your health, our priority</div>
      <div className="spinner"></div>
    </div>
  );
};

export default HomePage;