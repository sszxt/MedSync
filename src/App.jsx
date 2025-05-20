import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./route/PrivateRoute";
import HomePage from "./pages/HomePage";
import PatientDashboard from "./pages/PatientDashboard";
import PatientHealthForm from "./pages/PatientHealthForm";
import TabletTracker from "./pages/TabletTracker";
import VaultPage from "./pages/VaultPage";
import HospitalMap from "./pages/HospitalMap";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/AdminDashboard";
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              
                <HomePage />
              
            }
          />
          {/* Protected routes */}
          <Route
            path="/patientdashboard"
            element={
              <PrivateRoute>
                <PatientDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/healthtrack"
            element={
              <PrivateRoute>
                <PatientHealthForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/tabtrack"
            element={
              <PrivateRoute>
                <TabletTracker />
              </PrivateRoute>
            }
          />
          <Route
            path="/vault"
            element={
              <PrivateRoute>
                <VaultPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/map"
            element={
              <PrivateRoute>
                <HospitalMap />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute adminOnly>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
export default App;
