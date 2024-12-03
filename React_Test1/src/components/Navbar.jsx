import React from 'react';
import { Link } from 'react-router-dom';
import './css/Navbar.css';
import logo from '../assets/image.png';

function Navbar() {
  return (
    <div className="navbar">
      {/* Logo Section */}
      <div className="navbar-logo">
        <img src={logo} alt="Ruk-Com Logo" />
        <h1>Cyber Attacker Map</h1>
      </div>

      {/* Menu Section */}
      <div className="menu">
        <Link to="/">Home</Link>
        <Link to="/Analytic">Analytic</Link>
        <a href="https://ruk-com.cloud/" target="_blank" rel="noopener noreferrer">
          Ruk-Com Site
        </a>
      </div>
    </div>
  );
}

export default Navbar;
