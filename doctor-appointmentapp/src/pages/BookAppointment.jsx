import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import "../styles/BookAppointment.css";

const BookAppointment = () => {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    email: "",
    reason: "",
    date: "",
    time: "",
    patientNotes: ""
  });

  useEffect(() => {
    // Get patient info from localStorage
    const userData = localStorage.getItem('govcare_user');
    if (userData) {
      const user = JSON.parse(userData);
      setPatient(user);
      
      // Pre-fill patient details if available
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        age: user.age || "",
        phone: user.phone || "",
        email: user.email || ""
      }));
    }

    if (doctorId) {
      // Fetch doctor details if specific doctor is selected
      const fetchDoctor = async () => {
        try {
          const res = await API.get(`/doctors/${doctorId}`);
          setDoctor(res.data);
        } catch (err) {
          console.error("Error fetching doctor:", err);
          alert("Error loading doctor details");
        } finally {
          setLoading(false);
        }
      };
      fetchDoctor();
    } else {
      setLoading(false);
    }
  }, [doctorId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // If no doctorId, show error
      if (!doctorId) {
        alert("Please select a doctor first from the doctors page");
        return;
      }

      // Validate required fields
      if (!formData.name || !formData.age || !formData.phone || !formData.email || !formData.reason || !formData.date || !formData.time) {
        alert("Please fill all required fields");
        return;
      }

      const appointmentData = {
        doctorId: doctorId,
        date: formData.date,
        time: formData.time,
        reason: formData.reason,
        patientNotes: formData.patientNotes
      };

      console.log("Booking appointment:", appointmentData);

      const res = await API.post("/appointments/book", appointmentData);
      alert("Appointment booked successfully!");
      window.location.href = "/my-appointments";
    } catch (err) {
      console.error("Booking error:", err);
      alert(err.response?.data?.message || "Error booking appointment");
    }
  };

  if (loading) {
    return <div className="appointment-page">Loading...</div>;
  }

  return (
    <div className="appointment-page">
      <div className="appointment-container">
        <h2>Book Appointment</h2>
        
        {doctor && (
          <div className="doctor-info">
            <h3>Dr. {doctor.name}</h3>
            <p><strong>Specialization:</strong> {doctor.specialization}</p>
            <p><strong>Hospital:</strong> {doctor.hospital}</p>
          </div>
        )}

        {!doctorId && (
          <div className="no-doctor-selected">
            <p>Please select a doctor from the doctors page to book an appointment</p>
            <a href="/doctors" className="back-to-doctors">Browse Doctors</a>
          </div>
        )}

        {doctorId && (
          <form onSubmit={handleSubmit} className="appointment-form">
            <div className="form-section">
              <h3>Patient Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Age *</label>
                  <input
                    type="number"
                    name="age"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    min="1"
                    max="120"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{10}"
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Appointment Details</h3>
              <div className="form-group">
                <label>Reason for Appointment *</label>
                <textarea
                  name="reason"
                  placeholder="Describe your symptoms or reason for appointment"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  rows="3"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Preferred Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group">
                  <label>Preferred Time *</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Additional Notes (Optional)</label>
                <textarea
                  name="patientNotes"
                  placeholder="Any additional information you want to share with the doctor"
                  value={formData.patientNotes}
                  onChange={handleChange}
                  rows="2"
                />
              </div>
            </div>

            <button type="submit" className="appointment-btn">
              Confirm Appointment
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;