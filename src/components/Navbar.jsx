import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./css/Navbar.css";
import logo from "../assets/logo_meloncloud-400x59.png";
import Swal from "sweetalert2";

function Navbar() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ username: "Guest", role: "Visitor" });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const fetchUser = () => {
      const storedUser = JSON.parse(localStorage.getItem("user_info"));
      if (storedUser) {
        setUserInfo(storedUser);
      }
    };

    fetchUser();
    const handleStorageChange = () => {
      fetchUser();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [location]);

  const handleLogout = () => {
    Swal.fire({
        title: "Are you sure?",
        text: "You will be logged out from the system.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, logout!",
        cancelButtonText: "Cancel"
    }).then((result) => {
        if (result.isConfirmed) {
            // ลบข้อมูล LocalStorage และทำ Logout
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user_info");
            window.dispatchEvent(new Event("storage"));

            Swal.fire({
                icon: "success",
                title: "Logged Out!",
                text: "You have successfully logged out.",
                showConfirmButton: false,
                timer: 2000
            });

            setTimeout(() => {
                navigate("/login"); // Redirect ไปหน้า Login
                setIsDropdownOpen(false); // ปิด dropdown หลัง logout
            }, 2000);
        }
    });
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="navbar">
      {/* Logo Section */}
      <div className="navbar-logo">
        <img src={logo} alt="meloncloud Logo" />
        <span>Cyber Attacker Map</span>
      </div>

      {/* Menu Section */}
      <div className="menu">
        <Link to="/">MAP</Link>
        <Link to="/Analytic">Analytic</Link>
        <a href="https://melon.cloud/" target="_blank" rel="noopener noreferrer">
          Contact
        </a>

        {/* User Dropdown */}
        <div className="user-dropdown">
          <div className="user-status" onClick={toggleDropdown}>
            <span className="user-icon">👤</span>
            <span className="user-name">{userInfo.username}</span>
            <span className="dropdown-arrow">▼</span>
          </div>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <span className="user-role">Role: {userInfo.role}</span>
              </div>
              {userInfo.role === "admin" && (
                <Link to="/UserManagement" onClick={() => setIsDropdownOpen(false)}>
                  User Management
                </Link>
              )}
              <Link to="/change-password" onClick={() => setIsDropdownOpen(false)}>
                Change Password
              </Link>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;