import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DoctorDashboard from "./pages/DoctorDashboard";
import Doctors from "./pages/Doctor";
import Home from "./pages/Home";
import Register from "./pages/Register";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import Contact from "./pages/Contact";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctors" element={<Doctors />} />
        
        {/* Add this route for booking with specific doctor */}
        <Route path="/book-appointment/:doctorId" element={<BookAppointment />} />
        
        {/* Keep this for general booking without specific doctor */}
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/my-appointments" element={<MyAppointments />} />

        <Route path="/contact" element={<Contact />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;