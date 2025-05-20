import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaChartLine,
  FaFileMedical,
  FaTablets,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
const AdminSidebar = () => {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const menuItems = [
    { path: "/admin", icon: <FaHome />, label: "Dashboard" },
    { path: "/admin/users", icon: <FaUsers />, label: "Users" },
    {
      path: "/admin/health-records",
      icon: <FaFileMedical />,
      label: "Health Records",
    },
    { path: "/admin/medications", icon: <FaTablets />, label: "Medications" },
    { path: "/admin/analytics", icon: <FaChartLine />, label: "Analytics" },
    { path: "/admin/settings", icon: <FaCog />, label: "Settings" },
  ];
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div
      className="fixed flex flex-col h-full w-64 bg-gradient-to-b from-gray-900 togray-
800 text-white shadow-xl z-50"
    >
      {/* Sidebar Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="text-3xl text-indigo-400"
          >
            <FaChartLine />
          </motion.div>
          <span
            className="text-2xl font-bold bg-gradient-to-r from-indigo-400 topurple-
300 bg-clip-text text-transparent"
          >
            Admin Panel
          </span>
        </div>
      </div>
      {/* Sidebar Menu */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <nav className="space-y-1">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const baseClasses = `relative flex items-center px-4 py-3 rounded-lg
transition-all duration-200 ${
              isActive
                ? "bg-opacity-20 text-white shadow-md"
                : "text-gray-300hover:bg-gray-700 hover:bg-opacity-10"
            }`;
            const content = (
              <>
                {isHovered === index && (
                  <motion.span
                    layoutId="sidebar-hover"
                    className="absolute left-0 top-0 w-full h-full bg-opacity-10
rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
                <span
                  className={`text-lg mr-3 ${
                    isActive ? "text-white" : "text-gray-400"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute right-4 w-2 h-2 bg-indigo-400 rounded-full"
                  />
                )}
              </>
            );
            return (
              <Link
                to={item.path}
                key={index}
                className={baseClasses}
                onMouseEnter={() => setIsHovered(index)}
                onMouseLeave={() => setIsHovered(null)}
              >
                {content}
              </Link>
            );
          })}
        </nav>
      </div>
      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 rounded-lg text-gray-300
hover:bg-gray-700 hover:bg-opacity-10 transition-colors duration-200"
        >
          <span className="text-lg mr-3 text-indigo-400">
            <FaSignOutAlt />
          </span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};
export default AdminSidebar;
