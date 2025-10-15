const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const moment = require('moment');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Notification = require('../models/Notification');
const router = express.Router();

// Middleware to verify token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Book appointment
router.post('/book', auth, async (req, res) => {
  try {
    const { doctorId, date, time, reason, patientNotes } = req.body;

    if (!doctorId || !date || !time || !reason) {
      return res.status(400).json({ message: 'Doctor, date, time, and reason are required' });
    }

    // Check if doctor exists
    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const appointment = new Appointment({
      patient: req.userId,
      doctor: doctorId,
      date,
      time,
      reason,
      patientNotes: patientNotes || ''
    });

    await appointment.save();

    // Populate appointment details for response
    await appointment.populate('doctor', 'name email specialization');
    await appointment.populate('patient', 'name email phone');

    // Create notification for doctor
    const notification = new Notification({
      user: doctorId,
      type: 'appointment_status',
      message: `New appointment request from ${appointment.patient.name}`,
      appointment: appointment._id
    });
    await notification.save();

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get appointments for patient
router.get('/my-appointments', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.userId })
      .populate('doctor', 'name specialization experience fees')
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get appointments for doctor (doctor dashboard)
router.get('/doctor-appointments', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can access this endpoint' });
    }

    const appointments = await Appointment.find({ doctor: req.userId })
      .populate('patient', 'name email phone age gender')
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update appointment status (accept/reject)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status, doctorNotes } = req.body;
    
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be either "accepted" or "rejected"' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    //mail
    

    // Check if user is the doctor for this appointment
    if (appointment.doctor.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    appointment.status = status;
    if (doctorNotes) {
      appointment.doctorNotes = doctorNotes;
    }

    await appointment.save();

    // Populate for notification
    await appointment.populate('patient', 'name email');
    await appointment.populate('doctor', 'name');

    // Create notification for patient
    const notification = new Notification({
      user: appointment.patient._id,
      type: 'appointment_status',
      message: `Your appointment with Dr. ${appointment.doctor.name} has been ${status}`,
      appointment: appointment._id
    });
    await notification.save();

    // Send email notification if email is configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        let emailSubject = '';
        let emailHtml = '';

        if (status === 'accepted') {
          emailSubject = 'Appointment Accepted';
          emailHtml = `
            <h3>Appointment Accepted</h3>
            <p>Your appointment with Dr. ${appointment.doctor.name} has been accepted.</p>
            <p><strong>Date:</strong> ${moment(appointment.date).format('YYYY-MM-DD')}</p>
            <p><strong>Time:</strong> ${appointment.time}</p>
            ${appointment.doctorNotes ? `<p><strong>Doctor Notes:</strong> ${appointment.doctorNotes}</p>` : ''}
            <p>You will receive a reminder 10 minutes before your appointment.</p>
          `;
        } else {
          emailSubject = 'Appointment Rejected';
          emailHtml = `
            <h3>Appointment Rejected</h3>
            <p>Your appointment with Dr. ${appointment.doctor.name} has been rejected.</p>
            ${appointment.doctorNotes ? `<p><strong>Reason:</strong> ${appointment.doctorNotes}</p>` : ''}
            <p>Please book another slot with another doctor.</p>
          `;
        }

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: appointment.patient.email,
          subject: emailSubject,
          html: emailHtml
        });
        
        console.log(`Status email sent to ${appointment.patient.email}`);
      } catch (emailError) {
        console.error('Error sending status email:', emailError);
      }
    }

    res.json({
      message: `Appointment ${status} successfully`,
      appointment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;