const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const moment = require('moment');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/doctor_appointment', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const User = require('./models/User');
const Appointment = require('./models/Appointment');
const Notification = require('./models/Notification');

app.use('/api/auth', require('./routes/auth'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/notifications', require('./routes/notifications'));

app.get('/', (req, res) => {
  res.json({ message: 'Doctor Appointment System API is running!' });
});

cron.schedule('*/10 * * * *', async () => {
  try {
    console.log('Running appointment reminder check...');
    const now = moment();
    const appointments = await Appointment.find({
      status: 'accepted',
      date: { 
        $gte: now.startOf('day').toDate(),
        $lte: now.endOf('day').toDate()
      }
    }).populate('patient doctor');

    for (let appointment of appointments) {
      const appointmentTime = moment(appointment.time, 'HH:mm');
      const appointmentDateTime = moment(appointment.date)
        .set('hour', appointmentTime.get('hour'))
        .set('minute', appointmentTime.get('minute'));
      
      const reminderTime = moment(appointmentDateTime).subtract(10, 'minutes');
      
      if (moment().isSameOrAfter(reminderTime) && moment().isBefore(appointmentDateTime)) {
        const existingNotification = await Notification.findOne({
          appointment: appointment._id,
          type: 'reminder'
        });

        if (!existingNotification) {
          const reminderNotification = new Notification({
            user: appointment.patient._id,
            type: 'reminder',
            message: `Reminder: Your appointment with Dr. ${appointment.doctor.name} is at ${appointment.time}`,
            appointment: appointment._id
          });
          await reminderNotification.save();

          if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
              await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: appointment.patient.email,
                subject: 'Appointment Reminder',
                html: `
                  <h3>Appointment Reminder</h3>
                  <p>Your appointment with Dr. ${appointment.doctor.name} is scheduled in 10 minutes.</p>
                  <p>Time: ${appointment.time}</p>
                  <p>Date: ${moment(appointment.date).format('YYYY-MM-DD')}</p>
                `
              });
              console.log(`Reminder sent to ${appointment.patient.email}`);
            } catch (emailError) {
              console.error('Error sending email reminder:', emailError);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in reminder cron job:', error);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});