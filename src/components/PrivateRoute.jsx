import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children , requiredRole }) => {
  // ตรวจสอบว่ามี access_token หรือไม่
  const accessToken = localStorage.getItem("access_token");
  const user = JSON.parse(localStorage.getItem("user_info"));

  if (!accessToken) {
    // หากไม่มี access_token, นำทางไปยังหน้า Login
    return <Navigate to="/login" />;
  }
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />;
  }
  // หากมี access_token, แสดงเนื้อหาภายใน Protected Route
  return children;
};

export default PrivateRoute;
