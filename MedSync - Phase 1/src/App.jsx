import React from "react";
import Dashboard from "./Dashboard";
import "./index.css";
import RegistrationPage from "./pages/RegistrationPage";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Patientdetails from "./pages/Patientdetails";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AppointmentPage from "./pages/AppointmentPage";
import DoctorsPage from "./pages/DoctorsPage";
import NotificationsPage from "./pages/NotificationsPage";
import ChatbotPage from "./pages/ChatbotPage";
import PatientDashboard from "./pages/PatientDashboard";
import Adminlogin from "./pages/Adminlogin";



function App() {

  
  return (
    
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<RegistrationPage/>}></Route>
          <Route path="/login" element={<LoginPage/>}></Route>
          <Route path="/Dashboard" element={<Dashboard/>}></Route>
          <Route path="/patientr" element={<Patientdetails/>}></Route>
          <Route path="/home" element={<HomePage/>}></Route>
          <Route path="/appointment" element={<AppointmentPage/>}></Route>
          <Route path="/doctors" element={<DoctorsPage/>}></Route>
          <Route path="/notifications" element={<NotificationsPage/>}></Route>
          <Route path="/chatbot" element={<ChatbotPage/>}></Route>
          <Route path="/patientdashboard" element={<PatientDashboard/>}></Route>
          <Route path="/admin-login" element={<Adminlogin/>}></Route>
          
          
        </Routes>
        
        {/* <LoginPage/> */}

        {/* <HomePage/> */}

        {/* <RegistrationPage/> */}

        {/* <Dashboard/> */}
     
        {/* <Patientdetails/> */}
        
      </BrowserRouter>


      

      
    </div>
  );
}

export default App;
