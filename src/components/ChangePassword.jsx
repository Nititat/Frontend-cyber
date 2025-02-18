import React, { useState } from "react";
import axios from "axios";
import "/css/ChangePassword.css";

function ChangePassword() {
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // Fetch API IP and PORT from environment variables
  const API_IP = import.meta.env.VITE_API_IP;
  const API_PORT = import.meta.env.VITE_API_PORT;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset any previous messages
    setMessage("");
    
    // Basic validation
    if (newPassword.length < 8) {
        setMessage("New password must be at least 8 characters long");
        return;
    }
    
    if (newPassword !== confirmPassword) {
        setMessage("New password and confirm password do not match");
        return;
    }
    
    const token = localStorage.getItem("access_token");
    
    try {
        const response = await axios.put(
            `https://${API_IP}:${API_PORT}/api/change-password`,
            {
                currentPassword,
                newPassword,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        
        if (response.status === 200) {
            setMessage("Password changed successfully!");
            // Clear form
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }
    } catch (error) {
        if (error.response) {
            // Use error message from server if available
            setMessage(error.response.data.msg || "Failed to change password");
        } else {
            setMessage("Network error occurred");
        }
        console.error("Error changing password:", error);
    }
};

  return (
    <div className="change-password">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Change Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ChangePassword;
