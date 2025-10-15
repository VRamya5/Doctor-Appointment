import React, { useState } from "react";
import "../styles/Register.css";
import API from "../services/api";

function Register() {
  const [role, setRole] = useState("patient");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    age: "",
    gender: "",
    hospital: "",
    sector: ""
  });
  const [loading, setLoading] = useState(false);

  // Tamil Nadu Government Hospitals
  const tamilNaduHospitals = [
    "Government General Hospital, Chennai",
    "Rajiv Gandhi Government General Hospital, Chennai",
    "Government Stanley Medical College Hospital, Chennai",
    "Government Kilpauk Medical College Hospital, Chennai",
    "Government Mohan Kumaramangalam Medical College Hospital, Salem",
    "Government Theni Medical College Hospital, Theni",
    "Government Thiruvarur Medical College Hospital, Thiruvarur",
    "Government Vellore Medical College Hospital, Vellore",
    "Government Villupuram Medical College Hospital, Villupuram",
    "Government Dharmapuri Medical College Hospital, Dharmapuri",
    "Government Thoothukudi Medical College Hospital, Thoothukudi",
    "Government Tirunelveli Medical College Hospital, Tirunelveli",
    "Government Madurai Medical College Hospital, Madurai",
    "Government Coimbatore Medical College Hospital, Coimbatore",
    "Government Tiruppur Medical College Hospital, Tiruppur",
    "Government Kanyakumari Medical College Hospital, Nagercoil",
    "Government Ramanathapuram Medical College Hospital, Ramanathapuram",
    "Government Sivaganga Medical College Hospital, Sivaganga",
    "Government Pudukkottai Medical College Hospital, Pudukkottai",
    "Government Thanjavur Medical College Hospital, Thanjavur"
  ];

  // Medical Sectors/Specializations
  const medicalSectors = [
    "General Medicine",
    "Cardiology",
    "Orthopedics",
    "Neurology",
    "Pediatrics",
    "Gynecology",
    "Dermatology",
    "Psychiatry",
    "Dentistry",
    "ENT (Ear, Nose, Throat)",
    "Ophthalmology",
    "Surgery",
    "Urology",
    "Nephrology",
    "Oncology",
    "Endocrinology",
    "Gastroenterology",
    "Pulmonology",
    "Rheumatology",
    "Emergency Medicine"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Prepare data based on role
      const requestData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role,
        phone: formData.phone
      };

      if (role === "patient") {
        requestData.age = parseInt(formData.age);
        requestData.gender = formData.gender;
      } else {
        requestData.specialization = formData.sector;
        requestData.hospital = formData.hospital;
        requestData.experience = 0;
        requestData.fees = 0;
      }

      console.log("Sending registration data:", requestData);

      const res = await API.post("/auth/register", requestData);
      alert("Registered successfully!");
      window.location.href = "/login";
    } catch (err) {
      console.error("Registration error:", err);
      alert(err.response?.data?.message || "Error occurred while registering");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2>Create an Account</h2>

        {/* Role Toggle */}
        <div className="role-toggle">
          <button
            type="button"
            className={role === "patient" ? "active" : ""}
            onClick={() => setRole("patient")}
          >
            Patient
          </button>
          <button
            type="button"
            className={role === "doctor" ? "active" : ""}
            onClick={() => setRole("doctor")}
          >
            Doctor
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Common Fields for Both Roles */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            pattern="[0-9]{10}"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />

          {/* Patient Specific Fields */}
          {role === "patient" && (
            <div className="patient-fields">
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                required
                min="1"
                max="120"
              />
              
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}

          {/* Doctor Specific Fields */}
          {role === "doctor" && (
            <div className="doctor-fields">
              <select
                name="hospital"
                value={formData.hospital}
                onChange={handleChange}
                required
              >
                <option value="">Select Government Hospital</option>
                {tamilNaduHospitals.map((hospital, index) => (
                  <option key={index} value={hospital}>
                    {hospital}
                  </option>
                ))}
              </select>
              <br></br>
              <br></br>

              <select
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                required
              >
                <option value="">Select Medical Sector</option>
                {medicalSectors.map((sector, index) => (
                  <option key={index} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button 
            type="submit" 
            className={`register-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? '' : 'Register'}
          </button>
        </form>

        <p className="login-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Register;