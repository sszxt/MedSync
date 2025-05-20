import React, { useState, useEffect } from "react";
import {
  FaHeartbeat,
  FaWeight,
  FaTint,
  FaNotesMedical,
  FaBell,
  FaPlusCircle,
  FaHistory,
} from "react-icons/fa";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Link } from "react-router-dom";
import PatientSidebar from "../components/PatientSidebar";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
const PatientDashboard = () => {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState([]);
  const [medicalConditions, setMedicalConditions] = useState([]);
  const [currentStats, setCurrentStats] = useState({
    bloodPressure: "0",
    weight: "0",
    bloodSugar: "0",
    height: "0",
  });
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/health", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setHealthData(res.data.data);
        if (res.data.data.length > 0) {
          const latest = res.data.data[res.data.data.length - 1];
          setCurrentStats({
            bloodPressure: latest.bloodPressure || "120/80",
            weight: latest.weight || "70",
            bloodSugar: latest.bloodSugar || "95",
            height: latest.height || "175",
          });
        }
        // Calculate conditions distribution
        const conditionCount = res.data.data.reduce((acc, entry) => {
          entry.conditions?.forEach((condition) => {
            acc[condition] = (acc[condition] || 0) + 1;
          });
          return acc;
        }, {});
        const totalEntries = res.data.data.length || 1;
        const conditionsData = Object.entries(conditionCount).map(
          ([name, count]) => ({
            name,
            value: (count / totalEntries) * 100,
          })
        );
        setMedicalConditions(conditionsData);
      } catch (err) {
        console.error("Error loading health data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) {
      loadData();
    }
  }, [user]);
  const calculateBMI = () => {
    const weight = parseFloat(currentStats.weight);
    const height = parseFloat(currentStats.height) / 100;
    if (isNaN(weight) || isNaN(height) || height === 0) return 0;
    return weight / (height * height);
  };
  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };
  const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f59e0b"];
  const prepareChartData = () => {
    return healthData.slice(-6).map((entry) => ({
      date: new Date(entry.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      bloodPressure: parseInt(entry.bloodPressure.split("/")[0]),
      weight: parseFloat(entry.weight),
      bloodSugar: parseFloat(entry.bloodSugar),
    }));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <PatientSidebar />
      <div className="flex-1 overflow-y-auto ml-64 flex justify-center">
        <div className="w-full max-w-7xl px-4 py-8">
          <header className="bg-white shadow-sm rounded-xl px-6 py-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Health Dashboard <span className="text-3xl">📊</span>
                </h1>
                <p className="text-lg text-gray-500 mt-1">
                  Track your health metrics and progress
                </p>
              </div>
              <div className="flex space-x-4">
                <Link
                  to="/healthtrack"
                  className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <FaPlusCircle />
                  <span>Add Health Data</span>
                </Link>
                
              </div>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {/* Blood Pressure */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden p-6 flex items-center space-x-6 border-l-4 border-indigo-500"
            >
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                <FaHeartbeat className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-md font-medium text-gray-500">
                  Blood Pressure
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {currentStats.bloodPressure}{" "}
                  <span className="text-base">mmHg</span>
                </p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-green-100 text-green-800">
                  {parseInt(currentStats.bloodPressure.split("/")[0]) < 120
                    ? "Normal"
                    : "Elevated"}
                </span>
              </div>
            </motion.div>

            {/* Weight */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden p-6 flex items-center space-x-6 border-l-4 border-purple-500"
            >
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FaWeight className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-md font-medium text-gray-500">Weight</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {currentStats.weight} <span className="text-base">kg</span>
                </p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-blue-100 text-blue-800">
                  {healthData.length > 1
                    ? parseFloat(healthData[healthData.length - 1].weight) >
                      parseFloat(healthData[healthData.length - 2].weight)
                      ? "Increasing"
                      : "Decreasing"
                    : "Stable"}
                </span>
              </div>
            </motion.div>

            {/* BMI */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden p-6 flex items-center space-x-6 border-l-4 border-amber-500"
            >
              <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                <FaNotesMedical className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-md font-medium text-gray-500">BMI</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {calculateBMI().toFixed(1)}
                </p>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-medium ${
                    calculateBMI() < 18.5
                      ? "bg-blue-100 text-blue-800"
                      : calculateBMI() < 25
                      ? "bg-green-100 text-green-800"
                      : calculateBMI() < 30
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {getBMICategory(calculateBMI())}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Health Trends */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-2xl shadow-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Health Trends
                </h3>
                <Link
                  to="/patient/health-history"
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                >
                  <FaHistory className="mr-1" /> View Full History
                </Link>
              </div>
              <div className="h-80">
                {healthData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={prepareChartData()}>
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6b7280" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6b7280" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "0.5rem",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          border: "none",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="bloodPressure"
                        stroke="#ec4899"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Systolic BP"
                      />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#6366f1"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Weight (kg)"
                      />
                      <Line
                        type="monotone"
                        dataKey="bloodSugar"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Blood Sugar (mg/dL)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <p className="mb-4">No health data available</p>
                    <Link
                      to="/patient/health-form"
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Add your first health record
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Medical Conditions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-lg"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Medical Conditions
              </h3>
              <div className="h-80">
                {medicalConditions.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={medicalConditions}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {medicalConditions.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{ paddingTop: "20px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <p className="mb-4">No conditions recorded</p>
                    <Link
                      to="/patient/health-form"
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Add your health information
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Recent Records */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-lg mb-10"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Recent Health Records
              </h3>
              <Link
                to="/healthtrack"
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
              >
                <FaPlusCircle className="mr-1" /> Add New Record
              </Link>
            </div>
            {healthData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Blood Pressure</th>
                      <th className="pb-3">Weight</th>
                      <th className="pb-3">Blood Sugar</th>
                      <th className="pb-3">BMI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {healthData
                      .slice(-5)
                      .reverse()
                      .map((entry, index) => {
                        const bmi =
                          parseFloat(entry.weight) /
                          Math.pow(parseFloat(entry.height) / 100, 2);
                        return (
                          <tr
                            key={index}
                            className="border-b last:border-b-0 hover:bg-gray-50"
                          >
                            <td className="py-4">{entry.date}</td>
                            <td>{entry.bloodPressure}</td>
                            <td>{entry.weight} kg</td>
                            <td>{entry.bloodSugar} mg/dL</td>
                            <td>{bmi.toFixed(1)}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-4">No health records found</p>
                <Link
                  to="/patient/health-form"
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Create your first health record
                </Link>
              </div>
            )}
          </motion.div>
          {/* Remaining dashboard JSX here: stats grid, charts, medical condition pie, etc. */}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
