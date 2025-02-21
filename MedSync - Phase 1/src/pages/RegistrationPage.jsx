import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegistrationPage = () => {

  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const navigate = useNavigate()

  const handleSubmit = (e)=>{
    e.preventDefault()
    axios.post('http://localhost:5000/register',{name,email,password})
    .then(result =>{console.log(result)
      navigate('/login')
    })
    .catch(err=>console.log(err))
    
  }
  
  return (
    <div className="registration-container">
      <div className="registration-box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          {/* Full Name Input */}
          <div className="form-group">
            <label htmlFor="name"><strong>Name</strong></label>
            <input
              type="text"
              id="name"
              placeholder="Enter your full name"
              required
              onChange={(e)=>setName(e.target.value)}
            />
          </div>

          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email"><strong>Email</strong></label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              required
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password"><strong>Password</strong></label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              required
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>

          {/* Register Button */}
          <button type="submit" className="register-btn">
            Register
          </button>
        </form>

        {/* Link to Login */}
        <p className="login-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>

    
  );
};

export default RegistrationPage;
