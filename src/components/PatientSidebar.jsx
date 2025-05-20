import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome, FaNotesMedical, FaMapMarkerAlt, FaTablet, FaCog,
  FaHeartbeat, FaSignOutAlt, FaChartLine
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const PatientSidebar = () => {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/patientdashboard", icon: <FaHome />, label: "Dashboard" },
    { path: "/vault", icon: <FaNotesMedical />, label: "Vault" },
    { path: "/map", icon: <FaMapMarkerAlt />, label: "Map" },
    { path: "/tabtrack", icon: <FaTablet />, label: "Tablet Tracker" },
    { path: "http://127.0.0.1:5000/", icon: <FaCog />, label: "AI Chatbot", external: true }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="fixed flex flex-col h-full w-64 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white shadow-xl z-50">
      {/* Sidebar Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            className="text-3xl text-pink-400"
          >
            <FaHeartbeat />
          </motion.div>
          <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
            MedSync
          </span>
        </div>
      </div>

      {/* Sidebar Menu */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <nav className="space-y-1">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const baseClasses = `relative flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-opacity-20 text-white shadow-md bg-indigo-700'
                : 'text-indigo-100 hover:bg-indigo-800 hover:bg-opacity-10'
            }`;

            // Special case for Map and AI Chatbot: open in new tab
            if (item.label === "Map" || item.label === "AI Chatbot") {
              return (
                <a
                  href={item.path}
                  key={index}
                  className={baseClasses}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setIsHovered(index)}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  {isHovered === index && (
                    <motion.span
                      layoutId="sidebar-hover"
                      className="absolute left-0 top-0 w-full h-full bg-opacity-10 rounded-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                  <span className={`text-lg mr-3 ${isActive ? 'text-white' : 'text-indigo-200'}`}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </a>
              );
            }

            // Default: use Link
            return (
              <Link
                to={item.path}
                key={index}
                className={baseClasses}
                onMouseEnter={() => setIsHovered(index)}
                onMouseLeave={() => setIsHovered(null)}
              >
                {isHovered === index && (
                  <motion.span
                    layoutId="sidebar-hover"
                    className="absolute left-0 top-0 w-full h-full bg-opacity-10 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
                <span className={`text-lg mr-3 ${isActive ? 'text-white' : 'text-indigo-200'}`}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute right-4 w-2 h-2 bg-pink-400 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-indigo-700">
        <div className="flex items-center space-x-3 mb-4 px-2 py-3 rounded-lg hover:bg-indigo-700 hover:bg-opacity-10 transition-colors duration-200">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-indigo-800"></div>
          </div>
          <div>
            <div className="font-medium">{user?.name || 'User'}</div>
            
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-600 hover:bg-opacity-10 transition-colors duration-200"
        >
          <span className="text-lg mr-3 text-pink-300">
            <FaSignOutAlt />
          </span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default PatientSidebar;
