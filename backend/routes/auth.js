const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendWelcomePatientEmail, sendWelcomeDoctorEmail } = require('../utils/emailService');
const router = express.Router();

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d',
  });
};

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);

    const { name, email, password, role, specialization, hospital, experience, fees, phone, age, gender } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role || !phone) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        message: 'Name, email, password, phone, and role are required',
        received: req.body
      });
    }

    // Validate role
    if (!['patient', 'doctor'].includes(role)) {
      return res.status(400).json({ 
        message: 'Role must be either "patient" or "doctor"' 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user based on role
    const userData = {
      name,
      email,
      password,
      role,
      phone
    };

    if (role === 'patient') {
      if (!age || !gender) {
        return res.status(400).json({ 
          message: 'Age and gender are required for patients',
          required: ['age', 'gender']
        });
      }
      userData.age = age;
      userData.gender = gender;
    } else {
      // Doctor registration
      if (!specialization || !hospital) {
        return res.status(400).json({ 
          message: 'Specialization and hospital are required for doctors',
          required: ['specialization', 'hospital']
        });
      }
      userData.specialization = specialization;
      userData.hospital = hospital;
      userData.experience = experience || 0;
      userData.fees = fees || 0;
    }

    const user = new User(userData);
    await user.save();

    const token = generateToken(user._id);

    console.log('User registered successfully:', user.email);

    // Send welcome email based on role
    try {
      if (role === 'patient') {
        await sendWelcomePatientEmail(user);
        console.log('Welcome email sent to patient:', user.email);
      } else if (role === 'doctor') {
        await sendWelcomeDoctorEmail(user);
        console.log('Welcome email sent to doctor:', user.email);
      }
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail registration if email fails
    }

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialization: user.specialization,
        hospital: user.hospital,
        experience: user.experience,
        fees: user.fees,
        phone: user.phone,
        age: user.age,
        gender: user.gender
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    console.log('User logged in successfully:', user.email);

    // Prepare user response based on role
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone
    };

    // Add role-specific fields
    if (user.role === 'patient') {
      userResponse.age = user.age;
      userResponse.gender = user.gender;
    } else {
      userResponse.specialization = user.specialization;
      userResponse.hospital = user.hospital;
      userResponse.experience = user.experience;
      userResponse.fees = user.fees;
    }

    res.json({
      message: 'Login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get me error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
});

module.exports = router;