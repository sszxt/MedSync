import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PatientDetails = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    activeAllergies: '',
    currentMedications: '',
    previousMedications: '',
    currentConditions: '',
    previousConditions: '',
    otherIssues: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/patientr", formData);
      console.log("Response:", response.data);
      alert("✅ Patient details saved successfully!");
      navigate("/Dashboard");
    } catch (error) {
      console.error("❌ Error saving patient details:", error);
      alert("❌ Error submitting form. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <h2 className="form-title text-fuchsia-500">Patient Details Form</h2>
        <form onSubmit={handleSubmit}>
          {['name', 'age', 'height', 'weight'].map((field) => (
            <div key={field} className="form-group">
              <label className="form-label">
                {field.charAt(0).toUpperCase() + field.slice(1)}:
              </label>
              <input 
                type={field === 'age' || field === 'height' || field === 'weight' ? 'number' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          ))}
          <div className="form-group">
            <label className="form-label">Gender:</label>
            <select 
              name="gender" 
              value={formData.gender} 
              onChange={handleChange} 
              className="form-input"
              required
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {['activeAllergies', 'currentMedications', 'previousMedications', 'currentConditions', 'previousConditions', 'otherIssues'].map((field) => (
            <div key={field} className="form-group">
              <label className="form-label">
                {field.replace(/([A-Z])/g, ' $1').charAt(0).toUpperCase() + field.replace(/([A-Z])/g, ' $1').slice(1)}:
              </label>
              <textarea 
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="form-textarea"
              />
            </div>
          ))}
          <button 
            type="submit" 
            className="form-button"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientDetails;
