import React from "react";
import { FaNotesMedical, FaHeartbeat, FaCalendarAlt, FaBell, FaUserMd, FaWeight, FaTint } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import PatientSidebar from "../components/PatientSidebar";

const PatientDashboard = () => {
  // Mock data for health metrics
  const healthData = [
    { name: "Jan", bloodPressure: 120, weight: 70, sugar: 95 },
    { name: "Feb", bloodPressure: 125, weight: 71, sugar: 98 },
    { name: "Mar", bloodPressure: 118, weight: 69, sugar: 92 },
    { name: "Apr", bloodPressure: 122, weight: 72, sugar: 100 },
    { name: "May", bloodPressure: 119, weight: 70, sugar: 94 },
  ];

  // Breakdown of medical conditions
  const medicalConditions = [
    { name: "Diabetes", value: 40 },
    { name: "Hypertension", value: 30 },
    { name: "Obesity", value: 20 },
    { name: "Other", value: 10 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="dashboard-container">
      <PatientSidebar/>
      <div className="main-content">
        <Navbar />
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1>Welcome Back, John! 😊</h1>
            <p className="subtitle">Monitor your health and upcoming appointments.</p>
          </div>

          {/* Stats Section */}
          <div className="stats-grid">
            
            <div className="stat-card green">
              <FaHeartbeat className="stat-icon" />
              <div>
                <h3>Recorded Blood Pressure</h3>
                <span>120/80 mmHg</span>
                <p className="stat-trend">Normal Range</p>
              </div>
            </div>
            <div className="stat-card purple">
              <FaWeight className="stat-icon" />
              <div>
                
                <h3>Recorded Weight</h3>
                <span>70 kg</span>
                <p className="stat-trend">Stable</p>
              </div>
            </div>
            <div className="stat-card red">
              <FaTint className="stat-icon" />
              <div>
                <h3>Recorded Blood Sugar</h3>
                <span>95 mg/dL</span>
                <p className="stat-trend">Healthy Level</p>
              </div>
            </div>
            <div className="stat-card red">
              <FaCalendarAlt className="stat-icon" />
              <div>
                <h3>Upcoming Appointments</h3>
                <span>2 Scheduled</span>
                <p className="stat-trend">Next: 18th Feb</p>
              </div>
            </div>
            
          </div>

          {/* Charts Section */}
          <div className="charts-grid">
            <div className="chart-card">
              <h3>Health Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={healthData}>
                  <XAxis dataKey="name" stroke="#8884d8" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="bloodPressure" stroke="#FF8042" strokeWidth={3} dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="weight" stroke="#0088FE" strokeWidth={3} dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="sugar" stroke="#00C49F" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>Medical Conditions</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={medicalConditions}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {medicalConditions.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Doctors & Appointments Section */}
          <div className="content-grid">
            <div className="top-rated-doctors">
              <div className="section-header">
                <h3><FaUserMd /> Recommended Doctors</h3>
                <button className="view-all">View All →</button>
              </div>
              <div className="doctor-cards">
                <div className="doctor-card">
                  <img src="/doctor1.jpeg" alt="Dr. Alex" />
                  <div className="doctor-info">
                    <h4>Dr. Alex Johnson</h4>
                    <p className="specialty">Neurology</p>
                    <div className="rating">★★★★★ <span>(4.9/5)</span></div>
                    <p className="experience">10 years experience</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="recent-appointments">
              <div className="section-header">
                <h3>📋 Recent Appointments</h3>
                <button className="view-all">View All →</button>
              </div>
              <table className="appointment-table">
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Specialty</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Dr. Michael Smith</td>
                    <td>Cardiology</td>
                    <td>2024-02-10</td>
                    <td><span className="status completed">Completed</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="upcoming-appointments">
            <h3>⏳ Your Upcoming Appointments</h3>
            <div className="appointment-cards">
              <div className="appointment-card">
                <div className="appointment-info">
                  <img src="/doctor2.jpeg" alt="Doctor" />
                  <div>
                    <h4>Dr. Emily Brown</h4>
                    <p>Orthopedics - 10:00 AM</p>
                  </div>
                </div>
                <button className="reschedule-btn">Reschedule</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
