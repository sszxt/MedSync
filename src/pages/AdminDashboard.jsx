import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import AdminSidebar from "../components/AdminSidebar";
const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    patients: 0,
    healthRecords: 0,
    medications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/stats", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get("http://localhost:5000/api/admin/users?limit=5", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);
        setStats(statsRes.data);
        setRecentUsers(usersRes.data.users);
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2
border-indigo-500"
          ></div>
        </div>
      </div>
    );
  }
  const userGrowthData = [
    { name: "Jan", users: 10 },
    { name: "Feb", users: 25 },
    { name: "Mar", users: 45 },
    { name: "Apr", users: 70 },
    { name: "May", users: 100 },
    { name: "Jun", users: stats.users },
  ];
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto ml-64 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Admin Dashboard
        </h1>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-500 mb-2">
              Total Users
            </h3>
            <p className="text-3xl font-bold text-indigo-600">{stats.users}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-500 mb-2">Patients</h3>
            <p className="text-3xl font-bold text-green-600">
              {stats.patients}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-500 mb-2">
              Health Records
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {stats.healthRecords}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-500 mb-2">
              Medications
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {stats.medications}
            </p>
          </div>
        </div>
        {/* User Growth Chart */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            User Growth
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowthData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#6366F1" name="Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Recent Users Table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Users
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500
uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500
uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500
uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500
uppercase tracking-wider"
                  >
                    Joined
                  </th>
                </tr>
                13. AdminSidebar.jsx
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentUsers.map((user) => (
                  <tr key={user._id}>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium
text-gray-900"
                    >
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500
capitalize"
                    >
                      {user.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
