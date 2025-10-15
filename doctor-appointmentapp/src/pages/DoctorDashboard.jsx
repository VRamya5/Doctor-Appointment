import React, { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/DoctorDashboard.css";

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointments/doctor-appointments");
      setAppointments(res.data);
      calculateStats(res.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      alert("Error loading appointments");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (appointments) => {
    const stats = {
      total: appointments.length,
      pending: appointments.filter(apt => apt.status === "pending").length,
      accepted: appointments.filter(apt => apt.status === "accepted").length,
      rejected: appointments.filter(apt => apt.status === "rejected").length
    };
    setStats(stats);
  };

  const updateAppointmentStatus = async (appointmentId, status, notes = "") => {
    try {
      await API.put(`/appointments/${appointmentId}/status`, {
        status,
        doctorNotes: notes
      });
      alert(`Appointment ${status}`);
      fetchAppointments(); // Refresh the list
    } catch (err) {
      console.error("Error updating appointment:", err);
      alert("Error updating appointment");
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter === "all") return true;
    return apt.status === filter;
  });

  const getStatusClass = (status) => {
    return `status-${status}`;
  };

  if (loading) {
    return <div className="loading">Loading appointments</div>;
  }

  return (
    <div className="doctor-dashboard">
      <h2>Doctor Dashboard</h2>

      {/* Statistics Cards */}
      <div className="stats-cards">
        <div className="stat-card total">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Appointments</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card accepted">
          <div className="stat-number">{stats.accepted}</div>
          <div className="stat-label">Accepted</div>
        </div>
        <div className="stat-card rejected">
          <div className="stat-number">{stats.rejected}</div>
          <div className="stat-label">Rejected</div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <h4>Filter Appointments:</h4>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({stats.total})
          </button>
          <button 
            className={`filter-btn ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            Pending ({stats.pending})
          </button>
          <button 
            className={`filter-btn ${filter === "accepted" ? "active" : ""}`}
            onClick={() => setFilter("accepted")}
          >
            Accepted ({stats.accepted})
          </button>
          <button 
            className={`filter-btn ${filter === "rejected" ? "active" : ""}`}
            onClick={() => setFilter("rejected")}
          >
            Rejected ({stats.rejected})
          </button>
        </div>
      </div>

      {/* Appointments List */}
      <div className="appointments-list">
        <h3>Appointment Requests</h3>
        
        {filteredAppointments.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📅</div>
            <h4>No appointments found</h4>
            <p>You don't have any {filter !== "all" ? filter : ""} appointments at the moment.</p>
          </div>
        ) : (
          filteredAppointments.map(apt => (
            <div key={apt._id} className="appointment-card">
              {/* Notification badge for new pending appointments */}
              {apt.status === "pending" && (
                <div className="notification-badge">!</div>
              )}
              
              <h4>Patient: {apt.patient?.name || "N/A"}</h4>
              
              <div className="patient-info">
                <h5>Patient Details</h5>
                <div className="appointment-details">
                  <div className="detail-item">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{apt.patient?.email || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phone</span>
                    <span className="detail-value">{apt.patient?.phone || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Age</span>
                    <span className="detail-value">{apt.patient?.age || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Gender</span>
                    <span className="detail-value">{apt.patient?.gender || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="appointment-details">
                <div className="detail-item">
                  <span className="detail-label">Date</span>
                  <span className="detail-value">
                    {new Date(apt.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Time</span>
                  <span className="detail-value">{apt.time}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <span className={`detail-value ${getStatusClass(apt.status)}`}>
                    {apt.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-label">Reason</span>
                <span className="detail-value">{apt.reason}</span>
              </div>

              {apt.patientNotes && (
                <div className="detail-item">
                  <span className="detail-label">Patient Notes</span>
                  <span className="detail-value">{apt.patientNotes}</span>
                </div>
              )}

              {apt.doctorNotes && (
                <div className="detail-item">
                  <span className="detail-label">Your Notes</span>
                  <span className="detail-value">{apt.doctorNotes}</span>
                </div>
              )}
              
              {apt.status === "pending" && (
                <div className="action-buttons">
                  <button 
                    onClick={() => updateAppointmentStatus(apt._id, "accepted")}
                    className="accept-btn"
                  >
                    ✅ Accept Appointment
                  </button>
                  <button 
                    onClick={() => {
                      const notes = prompt("Please provide reason for rejection:");
                      if (notes !== null) {
                        updateAppointmentStatus(apt._id, "rejected", notes);
                      }
                    }}
                    className="reject-btn"
                  >
                    ❌ Reject Appointment
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DoctorDashboard;