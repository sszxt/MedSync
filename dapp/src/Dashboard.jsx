import React from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { FaUserInjured, FaUserMd, FaCalendarAlt, FaBell, FaStethoscope } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const Dashboard = () => {
  // Updated data for patient admissions over 12 months
  const patientData = [
    { name: 'Jan', patients: 120 },
    { name: 'Feb', patients: 150 },
    { name: 'Mar', patients: 170 },
    { name: 'Apr', patients: 160 },
    { name: 'May', patients: 180 },
    { name: 'Jun', patients: 140 },
    { name: 'Jul', patients: 190 },
    { name: 'Aug', patients: 210 },
    { name: 'Sep', patients: 200 },
    { name: 'Oct', patients: 230 },
    { name: 'Nov', patients: 220 },
    { name: 'Dec', patients: 250 },
  ];

  // More realistic demographic data
  const demographicData = [
    { name: 'Pediatrics', value: 120 },
    { name: 'Cardiology', value: 100 },
    { name: 'Orthopedics', value: 80 },
    { name: 'Neurology', value: 70 },
    { name: 'General Medicine', value: 130 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A833FF'];

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1>Welcome to MedSync! 🏥</h1>
            <p className="subtitle">Your Comprehensive Healthcare Management Platform</p>
          </div>

          {/* Stats Section */}
          <div className="stats-grid">
            <div className="stat-card red">
              <FaUserInjured className="stat-icon" />
              <div>
                <h3>Total Patients</h3>
                <span>12,450</span>
                <p className="stat-trend">↑ 12% from last month</p>
              </div>
            </div>
            <div className="stat-card green">
              <FaUserMd className="stat-icon" />
              <div>
                <h3>Active Doctors</h3>
                <span>98</span>
                <p className="stat-trend">↑ 8 new this month</p>
              </div>
            </div>
            <div className="stat-card blue">
              <FaCalendarAlt className="stat-icon" />
              <div>
                <h3>Appointments</h3>
                <span>1,526</span>
                <p className="stat-trend">102 today</p>
              </div>
            </div>
            <div className="stat-card purple">
              <FaBell className="stat-icon" />
              <div>
                <h3>Notifications</h3>
                <span>248</span>
                <p className="stat-trend">13 unread</p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-grid">
            <div className="chart-card">
              <h3>Patient Admissions Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={patientData}>
                  <XAxis dataKey="name" stroke="#8884d8" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="patients" stroke="#8884d8" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>Patient Demographics</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={demographicData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {demographicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Doctors & Patients Section */}
          <div className="content-grid">
            <div className="top-rated-doctors">
              <div className="section-header">
                <h3><FaStethoscope /> Top Rated Doctors</h3>
                <button className="view-all">View All →</button>
              </div>
              <div className="doctor-cards">
                <div className="doctor-card">
                  <img src="/doctor1.jpeg" alt="Dr. Daulat" />
                  <div className="doctor-info">
                    <h4>Dr. Daulat Hussain</h4>
                    <p className="specialty">Cardiology</p>
                    <div className="rating">★★★★☆ <span>(4.2/5)</span></div>
                    <p className="experience">15 years experience</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <div className="section-header">
                <h3>📋 Recent Patients</h3>
                <button className="view-all">View All →</button>
              </div>
              <table className="patient-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Visit Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>John Doe</td>
                    <td>Springfield</td>
                    <td>2024-02-15</td>
                    <td><span className="status completed">Completed</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="upcoming-appointments">
            <h3>⏳ Upcoming Appointments (Next 24 Hours)</h3>
            <div className="appointment-cards">
              <div className="appointment-card">
                <div className="patient-info">
                  <img src="/doctor2.jpeg" alt="Patient" />
                  <div>
                    <h4>Alice Johnson</h4>
                    <p>10:00 AM - Cardiology</p>
                  </div>
                </div>
                <button className="checkin-btn">Check In</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
