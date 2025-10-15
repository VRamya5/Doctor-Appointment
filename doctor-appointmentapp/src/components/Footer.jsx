import React from "react";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-section">
          <h3>GovCare</h3>
          <p>
            Government hospital appointment booking system for Tamil Nadu.
            Accessible, reliable, and patient-friendly.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/all-doctors">Doctors</a></li>
            <li><a href="/book-appointment">Book Appointment</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: support@govcare.in</p>
          <p>Phone: +91 98765 43210</p>
          <p>Tamil Nadu, India</p>
        </div>

        {/* Social Links */}
        <div className="footer-section social">
          <h4>Follow Us</h4>
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            Facebook
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            Twitter
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            Instagram
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} GovCare. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
