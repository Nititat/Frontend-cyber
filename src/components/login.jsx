import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/Login.css";
import Swal from "sweetalert2";
import confetti from "canvas-confetti";


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpConfigured, setOtpConfigured] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [otpStep, setOtpStep] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const API_IP = import.meta.env.VITE_API_IP;
      const API_PORT = import.meta.env.VITE_API_PORT;
      const API_ENDPOINT = `https://${API_IP}:${API_PORT}/api/login`;

      const response = await axios.post(API_ENDPOINT, {
        username,
        password,
      });

      const { otp_configured } = response.data;

      // localStorage.setItem("access_token", response.data.access_token);
      // localStorage.setItem("refresh_token", response.data.refresh_token);
      // localStorage.setItem("user_info", JSON.stringify(response.data.user_info));

      if (!otp_configured) {
        setOtpConfigured(false);
        fetchQrCode();
        return;
      }

      setOtpStep(true);
      setError("");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid username or password.");
    }
  };

  const fetchQrCode = async () => {
    try {
      const API_IP = import.meta.env.VITE_API_IP;
      const API_PORT = import.meta.env.VITE_API_PORT;
      const API_ENDPOINT = `https://${API_IP}:${API_PORT}/api/2fa/setup`;

      const response = await axios.post(
        API_ENDPOINT,
        { username },
        { responseType: "blob" }
      );

      const qrUrl = URL.createObjectURL(response.data);
      setQrCode(qrUrl);
    } catch (err) {
      console.error("Failed to fetch QR Code:", err);
      setError("Failed to fetch QR Code. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const API_IP = import.meta.env.VITE_API_IP;
      const API_PORT = import.meta.env.VITE_API_PORT;
      const API_ENDPOINT = `https://${API_IP}:${API_PORT}/api/2fa/verify`;
  
      const response = await axios.post(API_ENDPOINT, {
        username,
        otp,
      });
  
      if (response.data.access_token && response.data.refresh_token) {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        localStorage.setItem("user_info", JSON.stringify(response.data.user_info || {}));
        
        setError("");
        // alert("Login successful!");
        Swal.fire({
          title: "🎉 Welcome!",
          text: "Login was successful.",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
          background: "#fffff",
          color: "#000000",
          timerProgressBar: true,
          didOpen: () => {
              confetti({
                  particleCount: 100,
                  spread: 70,
                  origin: { y: 0.6 },
                  colors: ["#f39c12", "#e74c3c", "#9b59b6", "#3498db"]
              });
          }
      });
      
        navigate("/");
      } else {
        setError("Failed to retrieve tokens. Please contact support.");
      }
    } catch (err) {
      console.error("Failed to verify OTP:", err);
      setError(err.response?.data?.msg || "Failed to verify OTP. Please try again.");
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-box">
        {otpConfigured === false ? (
          <>
            {qrCode ? (
              <div className="qr-code-container">
                
                <p>Scan this QR Code with your 2FA App</p>
                <img src={qrCode} alt="QR Code" />
                <h1>Enter OTP</h1>
                <input
                  type="text"
                  placeholder="One-Time Password (OTP)"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="login-input"
                />
                <button onClick={handleVerifyOtp}  className="login-button">
                  Verify OTP
                </button>
                {error && <p className="login-error">{error}</p>}
              </div>
            ) : (
              <p>Loading QR Code...</p>
            )}
          </>
        ) : otpStep ? (
          <>
          <div className="two-factor-auth">
            <h2>Two-Factor Authentication </h2>
            <h1>To verify your identity enter the 6-digit code from your authenticator app.</h1>
            <input
              type="text"
              placeholder="One-Time Password (OTP)"
              value={otp}
              maxLength={6} // จำกัดจำนวนตัวอักษรให้เป็น 6 ตัว
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) { // ตรวจสอบว่าเป็นตัวเลขเท่านั้น
                  setOtp(value);
                }
              }}
              className="login-input"
            />

            <button onClick={handleVerifyOtp} className="login-button">
              Verify OTP
            </button>
            {error && <p className="login-error">{error}</p>}
          </div>
          </>
        ) : (
          <>
            <h2>Login</h2>
            <h4>Welcome to Melon Cloud</h4>
            <div className="login-inputs">
              <h1>Username</h1>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="login-input"
              />
              <h1>Password</h1>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
              />
              <button onClick={handleLogin} className="login-button">
                Login
              </button>
              {error && <p className="login-error">{error}</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
