import React, { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/Doctor.css";
import { useNavigate } from "react-router-dom";

function AllDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await API.get("/doctors/all");
        console.log("Doctors data:", res.data); // Debug: check what data is received
        setDoctors(res.data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        alert("Error loading doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleBookAppointment = (doctorId) => {
  console.log("Book appointment clicked for doctor:", doctorId);
  
  // Check if user is logged in
  const user = localStorage.getItem('govcare_user');
  console.log("User logged in:", !!user);
  
  if (!user) {
    alert('Please login first to book an appointment');
    navigate('/login');
    return;
  }
  
  // Navigate to book appointment page with doctor ID
  console.log("Navigating to:", `/book-appointment/${doctorId}`);
  navigate(`/book-appointment/${doctorId}`);
};

  if (loading) {
    return (
      <div className="doctors-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="doctors-page">
      <div className="doctors-header">
        <h2>Available Government Doctors</h2>
        <p>Book appointments with qualified medical professionals</p>
      </div>
      
      <div className="doctor-list">
        {doctors.length === 0 ? (
          <div className="no-doctors">
            <h3>No doctors available at the moment</h3>
            <p>Please check back later</p>
          </div>
        ) : (
          doctors.map(doc => (
            <div key={doc._id} className="doctor-card">
              <div className="doctor-avatar">
                {doc.name.charAt(0).toUpperCase()}
              </div>
              
              <div className="doctor-info">
                <h3>Dr. {doc.name}</h3>
                <div className="doctor-details">
                  <div className="detail-item">
                    <span className="label">Hospital:</span>
                    <span className="value">{doc.hospital || "Government Hospital"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Specialization:</span>
                    <span className="value">{doc.specialization || doc.sector || "General Medicine"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Experience:</span>
                    <span className="value">{doc.experience || 0} years</span>
                  </div>
                </div>
                
                <div className="doctor-actions">
                  <button 
                    className="book-btn"
                    onClick={() => handleBookAppointment(doc._id)}
                  >
                    <span className="btn-icon">📅</span>
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AllDoctors;