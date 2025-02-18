import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Analytic from "./components/Analytic";
import Map from "./components/Map";
import Classification from "./components/Classification";
import Country_Attack from "./components/Country_Attack";
import Data_Attack from "./components/Data_Attack";
import Login from "./components/login"; // เพิ่ม Login Component
import PrivateRoute from "./components/PrivateRoute"; // เพิ่ม PrivateRoute สำหรับหน้า Protected
import ChangePassword from "./components/ChangePassword"; // Import ChangePassword
import "./App.css";

import UserManagement from "./components/UserManagement"; // Import คอมโพเนนต์ใหม่

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

function Main() {
  const location = useLocation();

  // รายชื่อเส้นทางที่ไม่ต้องการแสดง Navbar
  const excludeNavbarRoutes = [""];
  const shouldShowNavbar = !excludeNavbarRoutes.includes(location.pathname);

  return (
    <div className="App">
      {/* แสดง Navbar เฉพาะเมื่อไม่อยู่ใน excludeNavbarRoutes */}
      {shouldShowNavbar && <Navbar />}
      <Routes>
        {/* เส้นทางสำหรับหน้า Login */}
        <Route path="/login" element={<Login />} />
        

        {/* เส้นทางที่ต้องการ Authentication */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <div className="main_page">
                <div className="container">
                  <div className="Map">
                    <Map />
                  </div>
                  <div className="container_bottom">
                    <div className="bottom_left">
                      <Classification />
                    </div>
                    <div className="bottom_right">
                      <Data_Attack />
                    </div>
                  </div>
                  <div className="rightsize">
                    <Country_Attack />
                  </div>
                </div>
              </div>
            </PrivateRoute>
          }
        />

        {/* เส้นทางไปยังหน้า Analytic */}
        <Route
          path="/Analytic"
          element={
            <PrivateRoute>
              <Analytic />
            </PrivateRoute>
          }
        />

        {/* เส้นทางไปยังหน้า User Management */}
        <Route
          path="/UserManagement"
          element={
            <PrivateRoute requiredRole="admin">
              <UserManagement />
            </PrivateRoute>
          }
        />

        <Route
        path="/change-password"
        element={
          <PrivateRoute>
            <ChangePassword />
          </PrivateRoute>
        }
        />
      </Routes>
      
        
      
    </div>
  );
}

export default App;
