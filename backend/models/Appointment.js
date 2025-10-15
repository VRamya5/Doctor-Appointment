const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled'],
    default: 'pending'
  },
  reason: {
    type: String,
    required: true
  },
  patientNotes: {
    type: String,
    default: ''
  },
  doctorNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for better query performance
appointmentSchema.index({ patient: 1, createdAt: -1 });
appointmentSchema.index({ doctor: 1, status: 1 });
appointmentSchema.index({ date: 1, time: 1 });

// Virtual for formatted date
appointmentSchema.virtual('formattedDate').get(function() {
  return this.date.toISOString().split('T')[0];
});

module.exports = mongoose.model('Appointment', appointmentSchema);