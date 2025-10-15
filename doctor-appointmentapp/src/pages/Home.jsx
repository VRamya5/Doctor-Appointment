import React, { useState } from "react";
import "../styles/Home.css";
import DoctorImg from "../assets/images/doctor.jpg";
import VideoBg from "../assets/videos/BgVideo.mp4";

const hospitals = [
  { name: "Chennai General Hospital", location: "Park Town, Chennai", contact: "044-2530 5000", timings: "8:00 AM - 6:00 PM" },
  { name: "Coimbatore Government Hospital", location: "Near Collectorate, Coimbatore", contact: "0422-230 3000", timings: "8:30 AM - 5:30 PM" },
  { name: "Madurai Rajaji Hospital", location: "Goripalayam, Madurai", contact: "0452-253 2535", timings: "9:00 AM - 6:00 PM" },
  { name: "Tiruchirappalli Government Hospital", location: "Central Bus Stand, Trichy", contact: "0431-270 1234", timings: "8:30 AM - 5:00 PM" },
  { name: "Salem Government Hospital", location: "Salem Town", contact: "0427-241 1000", timings: "8:00 AM - 4:30 PM" },
  { name: "Vellore Government Hospital", location: "Vellore Fort Road", contact: "0416-222 5555", timings: "9:00 AM - 5:30 PM" },
  { name: "Tirunelveli Medical College Hospital", location: "High Ground, Tirunelveli", contact: "0462-257 2737", timings: "8:00 AM - 5:00 PM" },
  { name: "Erode Government Hospital", location: "Erode Main Road", contact: "0424-226 2700", timings: "9:00 AM - 4:30 PM" },
  { name: "Thoothukudi Government Hospital", location: "Muttiahpuram, Thoothukudi", contact: "0461-234 4444", timings: "8:30 AM - 6:00 PM" },
  { name: "Dindigul Government Hospital", location: "Near Bus Stand, Dindigul", contact: "0451-246 1000", timings: "8:30 AM - 5:30 PM" },
  { name: "Kanyakumari Government Hospital", location: "Nagercoil", contact: "04652-225 300", timings: "9:00 AM - 5:30 PM" },
  { name: "Thanjavur Medical College Hospital", location: "Medical College Road, Thanjavur", contact: "04362-240 100", timings: "8:00 AM - 4:30 PM" },
  { name: "Krishnagiri Government Hospital", location: "Rayakottai Road, Krishnagiri", contact: "04343-225 700", timings: "8:30 AM - 5:00 PM" },
  { name: "Villupuram Government Hospital", location: "Near Railway Station, Villupuram", contact: "04146-222 444", timings: "9:00 AM - 5:00 PM" },
  { name: "Namakkal Government Hospital", location: "Kottai Road, Namakkal", contact: "04286-223 600", timings: "8:30 AM - 5:30 PM" },
  { name: "Dharmapuri Government Medical College Hospital", location: "Collectorate Road, Dharmapuri", contact: "04342-230 500", timings: "8:00 AM - 4:30 PM" },
  { name: "Ariyalur Government Hospital", location: "Near Bus Stand, Ariyalur", contact: "04329-222 300", timings: "8:00 AM - 5:00 PM" },
  { name: "Ramanathapuram Government Hospital", location: "Ramanathapuram Town", contact: "04567-220 233", timings: "9:00 AM - 5:30 PM" },
  { name: "Sivagangai Government Medical College Hospital", location: "Melur Road, Sivagangai", contact: "04575-242 888", timings: "8:30 AM - 5:30 PM" },
  { name: "Virudhunagar Government Hospital", location: "Virudhunagar Town", contact: "04562-245 200", timings: "8:00 AM - 4:30 PM" },
  { name: "Perambalur Government Hospital", location: "Near Bus Stand, Perambalur", contact: "04328-224 500", timings: "8:30 AM - 5:30 PM" },
  { name: "Nagapattinam Government Hospital", location: "Collector Office Road, Nagapattinam", contact: "04365-222 333", timings: "9:00 AM - 5:00 PM" },
  { name: "Nilgiris Government Hospital", location: "Udhagamandalam (Ooty)", contact: "0423-244 2345", timings: "8:00 AM - 4:30 PM" },
  { name: "Cuddalore Government Hospital", location: "Cuddalore OT", contact: "04142-220 222", timings: "8:30 AM - 5:30 PM" },
  { name: "Karur Government Hospital", location: "Old Erode Road, Karur", contact: "04324-232 100", timings: "8:00 AM - 5:00 PM" },
  { name: "Pudukkottai Government Medical College Hospital", location: "Thirumayam Road, Pudukkottai", contact: "04322-222 100", timings: "8:30 AM - 5:30 PM" },
  { name: "Tiruvannamalai Government Hospital", location: "Chengam Road, Tiruvannamalai", contact: "04175-220 500", timings: "8:30 AM - 5:30 PM" },
  { name: "Kancheepuram Government Hospital", location: "Railway Station Road, Kancheepuram", contact: "044-2722 1000", timings: "9:00 AM - 5:30 PM" },
  { name: "Thiruvallur Government Hospital", location: "Thiruvallur Town", contact: "044-2766 1223", timings: "8:30 AM - 4:30 PM" },
  { name: "Tenkasi Government Hospital", location: "Courtallam Main Road, Tenkasi", contact: "04633-224 444", timings: "9:00 AM - 5:00 PM" }
];


const Home = () => {
  const [selectedHospital, setSelectedHospital] = useState(null);

  return (
    <div className="home-container">
      {/* Video Background */}
      <video className="video-bg" autoPlay loop muted>
        <source src={VideoBg} type="video/mp4" />
      </video>

      {/* Hero Section */}
      <div className="hero-content">
        <div className="doctor-card">
          <img src={DoctorImg} alt="Doctor" />
          <h1>Welcome to GovCare</h1>
          <p>
            Your health, our priority. Book appointments with government hospital doctors across Tamil Nadu.
          </p>
          <a href="/book-appointment" className="btn-appointment">Book Appointment</a>
        </div>
      </div>

      {/* Hospitals Section */}
      <section className="hospitals">
        <h2>Tamil Nadu Government Hospitals</h2>
        <div className="hospital-list">
          {hospitals.map((hospital, index) => (
            <div
              key={index}
              className="hospital-card"
              onClick={() => setSelectedHospital(hospital)}
            >
              {hospital.name}
            </div>
          ))}
        </div>
      </section>

      {/* Doctors by Sector */}
      <section className="sectors">
        <h2>Doctors by Sector</h2>
        <div className="sector-list">
          <div className="sector-card">General Physician</div>
          <div className="sector-card">Pediatrician</div>
          <div className="sector-card">Veterinarian</div>
          <div className="sector-card">Cardiologist</div>
          <div className="sector-card">Neurologist</div>
          <div className="sector-card">Orthopedic</div>
          <div className="sector-card">Dermatologist</div>
          <div className="sector-card">Ophthalmologist (Eye Specialist)</div>
          <div className="sector-card">ENT Specialist</div>
          <div className="sector-card">Gynecologist & Obstetrician</div>
          <div className="sector-card">Oncologist</div>
          <div className="sector-card">Psychiatrist</div>
          <div className="sector-card">Dentist</div>
          <div className="sector-card">Nephrologist (Kidney Specialist)</div>
          <div className="sector-card">Urologist</div>
          <div className="sector-card">Pulmonologist (Chest & Lungs)</div>
          <div className="sector-card">Endocrinologist</div>
          <div className="sector-card">Rheumatologist</div>
          <div className="sector-card">Gastroenterologist</div>
          <div className="sector-card">Hematologist</div>
          <div className="sector-card">Emergency & Trauma</div>
          <div className="sector-card">Physiotherapist</div>
          <div className="sector-card">Anesthesiologist</div>
          <div className="sector-card">Radiologist</div>
          <div className="sector-card">Pathologist</div>
          <div className="sector-card">Plastic Surgeon</div>
          <div className="sector-card">General Surgeon</div>
          <div className="sector-card">Psychologist</div>
          <div className="sector-card">Community Medicine</div>
        </div>
      </section>

      {/* Available Doctors */}
      <section className="available-doctors">
        <h2>Available Doctors</h2>
        <div className="doctor-list">
          <div className="doctor-card-small">
            <img src={DoctorImg} alt="Doctor" />
            <h4>Dr. Ramesh</h4>
            <p>General Physician</p>
          </div>
          <div className="doctor-card-small">
            <img src={DoctorImg} alt="Doctor" />
            <h4>Dr. Meena</h4>
            <p>Pediatrician</p>
          </div>
          <div className="doctor-card-small">
            <img src={DoctorImg} alt="Doctor" />
            <h4>Dr. Kumar</h4>
            <p>Cardiologist</p>
          </div>
          <div className="doctor-card-small">
            <img src={DoctorImg} alt="Doctor" />
            <h4>Dr. Priya</h4>
            <p>Veterinarian</p>
          </div>
          <div className="doctor-card-small">
            <img src={DoctorImg} alt="Doctor" />
            <h4>Dr. Anitha</h4>
            <p>Gynecologist</p>
          </div>
        </div>
      </section>

      {/* Hospital Popup Modal */}
      {selectedHospital && (
        <div className="modal" onClick={() => setSelectedHospital(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedHospital.name}</h3>
            <p><strong>Location:</strong> {selectedHospital.location}</p>
            <p><strong>Contact:</strong> {selectedHospital.contact}</p>
            <p><strong>Timings:</strong> {selectedHospital.timings}</p>
            <button className="close-btn" onClick={() => setSelectedHospital(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
