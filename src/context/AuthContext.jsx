import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (token) {
          const res = await axios.get("http://localhost:5000/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(res.data.data);
        }
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [token]);
  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      navigate(res.data.user.role === "admin" ? "/admin" : "/patientdashboard");
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.error || "Login failed",
      };
    }
  };
  // Register function
  const register = async (name, email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);

      setUser(res.data.user);
      navigate("/patientdashboard");
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.error || "Registrationfailed",
      };
    }
  };
  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/login");
  };
  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => React.useContext(AuthContext);
