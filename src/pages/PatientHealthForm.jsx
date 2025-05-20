import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSave } from "react-icons/fa";
import { motion } from "framer-motion";
import PatientSidebar from "../components/PatientSidebar";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
const PatientHealthForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bloodPressure: "",
    weight: "",
    height: "",
    bloodSugar: "",
    conditions: [],
  });
  const medicalConditionsOptions = [
    "Diabetes",
    "Hypertension",
    "Obesity",
    "Heart Disease",
    "Asthma",
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/health", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate("/patientdashboard");
    } catch (err) {
      alert(
        "Failed to save health data: " +
          (err.response?.data?.error || err.message)
      );
    }
  };
  const handleConditionChange = (condition) => {
    setFormData((prev) => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter((c) => c !== condition)
        : [...prev.conditions, condition],
    }));
  };
  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:block">
        <PatientSidebar />
      </div>
      <div className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Health Information Update
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Pressure (mmHg)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  value={formData.bloodPressure}
                  onChange={(e) =>
                    setFormData({ ...formData, bloodPressure: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData({ ...formData, height: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Sugar (mg/dL)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  value={formData.bloodSugar}
                  onChange={(e) =>
                    setFormData({ ...formData, bloodSugar: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Medical Conditions
              </label>
              <div className="grid grid-cols-2 gap-3">
                {medicalConditionsOptions.map((condition) => (
                  <label
                    key={condition}
                    className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={formData.conditions.includes(condition)}
                      onChange={() => handleConditionChange(condition)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">{condition}</span>
                  </label>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 flex items-center justify-center space-x-2"
            >
              <FaSave className="h-5 w-5" />
              <span>Save Health Data</span>
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientHealthForm;
