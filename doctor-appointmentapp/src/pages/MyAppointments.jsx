import React, { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/MyAppointments.css";
import { useNavigate } from "react-router-dom";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('govcare_user');
    if (!user) {
      alert('Please login to view your appointments');
      navigate('/login');
      return;
    }

    fetchAppointments();
  }, [navigate]);

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointments/my-appointments");
      console.log("Appointments data:", res.data);
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      alert("Error loading appointments");
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      await API.put(`/appointments/${appointmentId}/cancel`);
      alert("Appointment cancelled successfully");
      fetchAppointments(); // Refresh the list
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      alert(err.response?.data?.message || "Error cancelling appointment");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: "status-pending", text: "Pending" },
      accepted: { class: "status-accepted", text: "Accepted" },
      rejected: { class: "status-rejected", text: "Rejected" },
      cancelled: { class: "status-cancelled", text: "Cancelled" }
    };
    
    const config = statusConfig[status] || { class: "status-pending", text: status };
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  if (loading) {
    return (
      <div className="my-appointments-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-appointments-page">
      <div className="appointments-header">
        <h2>My Appointments</h2>
        <p>View and manage your medical appointments</p>
      </div>

      <div className="appointments-container">
        {appointments.length === 0 ? (
          <div className="no-appointments">
            <div className="empty-icon">📅</div>
            <h3>Appointments </h3>
            <p>You have  booked any appointments </p>
            <button 
              onClick={() => navigate('/doctor-dashboard')}
              className="book-first-btn"
            >
              Explore in Dashboard
            </button>
          </div>
        ) : (
          <div className="appointments-list">
            {appointments.map(appointment => (
              <div key={appointment._id} className="appointment-card">
                <div className="appointment-header">
                  <h3>Dr. {appointment.doctor?.name}</h3>
                  {getStatusBadge(appointment.status)}
                </div>

                <div className="appointment-details">
                  <div className="detail-row">
                    <span className="label">Specialization:</span>
                    <span className="value">{appointment.doctor?.specialization}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Hospital:</span>
                    <span className="value">{appointment.doctor?.hospital}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Date:</span>
                    <span className="value">
                      {new Date(appointment.date).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Time:</span>
                    <span className="value">{appointment.time}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Reason:</span>
                    <span className="value">{appointment.reason}</span>
                  </div>
                  {appointment.patientNotes && (
                    <div className="detail-row">
                      <span className="label">Your Notes:</span>
                      <span className="value">{appointment.patientNotes}</span>
                    </div>
                  )}
                  {appointment.doctorNotes && (
                    <div className="detail-row">
                      <span className="label">Doctor's Notes:</span>
                      <span className="value">{appointment.doctorNotes}</span>
                    </div>
                  )}
                </div>

                <div className="appointment-actions">
                  {appointment.status === 'pending' && (
                    <button 
                      onClick={() => cancelAppointment(appointment._id)}
                      className="cancel-btn"
                    >
                      Cancel Appointment
                    </button>
                  )}
                  {appointment.status === 'accepted' && (
                    <div className="accepted-info">
                      <span className="success-text">✅ Your appointment has been confirmed!</span>
                      <p className="reminder-note">
                        You will receive a reminder 10 minutes before your appointment time.
                      </p>
                    </div>
                  )}
                  {appointment.status === 'rejected' && (
                    <div className="rejected-info">
                      <span className="error-text">❌ This appointment was rejected</span>
                      <button 
                        onClick={() => navigate('/doctors')}
                        className="book-new-btn"
                      >
                        Book New Appointment
                      </button>
                    </div>
                  )}
                </div>

                <div className="appointment-footer">
                  <span className="booked-date">
                    Booked on: {new Date(appointment.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAppointments;