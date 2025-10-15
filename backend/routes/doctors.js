const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
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

// Get all doctors (for patients)
router.get('/all', auth, async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' })
      .select('name specialization experience fees availability')
      .sort({ name: 1 });

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get doctor by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const doctor = await User.findOne({ 
      _id: req.params.id, 
      role: 'doctor' 
    }).select('name specialization experience fees availability');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update doctor availability
router.put('/availability', auth, async (req, res) => {
  try {
    const { availability } = req.body;
    const doctor = await User.findById(req.userId);

    if (!doctor || doctor.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can update availability' });
    }

    doctor.availability = availability || [];
    await doctor.save();

    res.json({
      message: 'Availability updated successfully',
      availability: doctor.availability
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;