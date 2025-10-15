import React, { useState } from "react";
import "../styles/Login.css";
import API from "../services/api";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending login data:", formData);
      
      const res = await API.post("/auth/login", formData);
      const { token, user } = res.data;

      // Save token and user info to localStorage
      localStorage.setItem("govcare_token", token);
      localStorage.setItem("govcare_user", JSON.stringify(user));

      console.log("Login successful, user role:", user.role);

      // Redirect based on role
      if (user.role === "doctor") {
        window.location.href = "/doctor-dashboard";
      } else {
        window.location.href = "/doctors";
      }
    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Welcome Back</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="register-link">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;