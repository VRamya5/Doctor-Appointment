import React, { useState, useEffect } from "react";
import "../styles/Navbar.css";
import { FaSignInAlt, FaUserPlus, FaBars, FaTimes, FaSignOutAlt, FaUser } from "react-icons/fa";
import Logo from "../assets/images/logo2.png";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('govcare_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [location]); // Re-run when location changes

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('govcare_token');
    localStorage.removeItem('govcare_user');
    
    // Reset user state
    setUser(null);
    
    // Close mobile menu if open
    setIsOpen(false);
    
    // Redirect to home page
    navigate('/');
    
    // Show logout message
    alert('Logged out successfully!');
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <img src={Logo} alt="GovCare Logo" onClick={() => navigate('/')} />
      </div>

      {/* Hamburger icon */}
      <div className="menu-icon" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Navigation Links */}
      <ul className={`navbar-links ${isOpen ? "active" : ""}`}>
        <li><a href="/" onClick={closeMenu}>Home</a></li>
        
        {/* Show different links based on user role */}
        {user && user.role === 'patient' && (
          <>
            <li><a href="/doctors" onClick={closeMenu}>Doctors</a></li>
            <li><a href="/book-appointment" onClick={closeMenu}>Book Appointment</a></li>
            <li><a href="/my-appointments" onClick={closeMenu}>My Appointments</a></li>
          </>
        )}
        
        {user && user.role === 'doctor' && (
          <>
            <li><a href="/doctor-dashboard" onClick={closeMenu}>Dashboard</a></li>
            <li><a href="/my-appointments" onClick={closeMenu}>Appointments</a></li>
          </>
        )}
        
        {/* Show these for non-logged in users */}
        {!user && (
          <>
            <li><a href="/doctors" onClick={closeMenu}>Doctors</a></li>
            <li><a href="/book-appointment" onClick={closeMenu}>Book Appointment</a></li>
          </>
        )}
        
        <li><a href="/contact" onClick={closeMenu}>Contact</a></li>
      </ul>

      {/* Login/Register or User Profile & Logout */}
      <div className="navbar-actions">
        {user ? (
          <div className="user-section">
            <span className="welcome-text">
              <FaUser style={{ marginRight: '5px' }} />
              Hi, {user.name}
            </span>
            <button onClick={handleLogout} className="logout-btn">
              <FaSignOutAlt />
            </button>
          </div>
        ) : (
          <>
            <a href="/login" className="login-btn">
              <FaSignInAlt />
            </a>
            <a href="/register" className="register-btn">
              <FaUserPlus />
            </a>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;