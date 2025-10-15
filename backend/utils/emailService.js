const nodemailer = require('nodemailer');
const moment = require('moment');

// Create transporter with govcareapp@gmail.com - FIXED: createTransporter -> createTransport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'govcareapp@gmail.com',
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error);
  } else {
    console.log('GovCare email server is ready to send messages');
  }
});

// Email templates
const emailTemplates = {
  welcomePatient: (user) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0;">Welcome to GovCare!</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Tamil Nadu Government Healthcare Portal</p>
      </div>
      <div style="padding: 30px; background: #f8f9fa;">
        <h2 style="color: #333;">Hello ${user.name}!</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          Welcome to GovCare - Your trusted healthcare partner. Your patient account has been successfully created.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #667eea;">
          <h3 style="color: #333; margin-top: 0;">Your Account Details:</h3>
          <p><strong>Name:</strong> ${user.name}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Phone:</strong> ${user.phone}</p>
          <p><strong>Age:</strong> ${user.age} years</p>
          <p><strong>Gender:</strong> ${user.gender}</p>
          <p><strong>Role:</strong> Patient</p>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: #e8f4fd; border-radius: 8px;">
          <p style="margin: 0; color: #31708f;">
            <strong>What you can do now:</strong>
          </p>
          <ul style="color: #31708f; margin: 10px 0 0 20px;">
            <li>Book appointments with government doctors</li>
            <li>View your appointment history</li>
            <li>Receive timely reminders</li>
            <li>Access quality healthcare services</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/doctors" 
             style="background: #27ae60; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Book Your First Appointment
          </a>
        </div>
      </div>
      <div style="background: #333; color: white; padding: 20px; text-align: center;">
        <p style="margin: 0;">Thank you for choosing GovCare - Tamil Nadu Government Healthcare</p>
        <p style="margin: 5px 0 0 0; font-size: 12px;">
          Contact: govcareapp@gmail.com | Helpline: 044-12345678
        </p>
      </div>
    </div>
  `,

  welcomeDoctor: (user) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #27ae60, #2ecc71); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0;">Welcome Doctor!</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Tamil Nadu Government Healthcare Portal</p>
      </div>
      <div style="padding: 30px; background: #f8f9fa;">
        <h2 style="color: #333;">Welcome Dr. ${user.name}!</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          Thank you for joining GovCare as a healthcare provider. Your account has been successfully created.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #27ae60;">
          <h3 style="color: #333; margin-top: 0;">Your Professional Details:</h3>
          <p><strong>Name:</strong> Dr. ${user.name}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Phone:</strong> ${user.phone}</p>
          <p><strong>Hospital:</strong> ${user.hospital}</p>
          <p><strong>Specialization:</strong> ${user.specialization}</p>
          <p><strong>Role:</strong> Doctor</p>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: #d4edda; border-radius: 8px;">
          <p style="margin: 0; color: #155724;">
            <strong>What you can do now:</strong>
          </p>
          <ul style="color: #155724; margin: 10px 0 0 20px;">
            <li>Receive appointment requests from patients</li>
            <li>Manage your appointment schedule</li>
            <li>Accept or reject appointment requests</li>
            <li>Provide quality healthcare services</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/doctor-dashboard" 
             style="background: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Go to Doctor Dashboard
          </a>
        </div>
      </div>
      <div style="background: #333; color: white; padding: 20px; text-align: center;">
        <p style="margin: 0;">Thank you for serving with GovCare - Tamil Nadu Government Healthcare</p>
        <p style="margin: 5px 0 0 0; font-size: 12px;">
          Contact: govcareapp@gmail.com | Helpline: 044-12345678
        </p>
      </div>
    </div>
  `,

  appointmentBooked: (patient, doctor, appointment) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0;">Appointment Booked Successfully</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">GovCare - Government Healthcare Portal</p>
      </div>
      <div style="padding: 30px; background: #f8f9fa;">
        <h2 style="color: #333;">Hello ${patient.name},</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          Your appointment has been successfully booked with <strong>Dr. ${doctor.name}</strong>.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #667eea;">
          <h3 style="color: #333; margin-top: 0;">Appointment Details:</h3>
          <p><strong>Doctor:</strong> Dr. ${doctor.name}</p>
          <p><strong>Specialization:</strong> ${doctor.specialization}</p>
          <p><strong>Hospital:</strong> ${doctor.hospital}</p>
          <p><strong>Date:</strong> ${moment(appointment.date).format('DD MMMM YYYY')}</p>
          <p><strong>Time:</strong> ${appointment.time}</p>
          <p><strong>Reason:</strong> ${appointment.reason}</p>
          <p style="color: #667eea; font-weight: bold;">Status: Pending Approval</p>
        </div>
        
        <p style="color: #666;">
          The doctor will review your appointment request and you'll receive another email once it's accepted or rejected.
        </p>
        
        <div style="margin-top: 30px; padding: 20px; background: #e8f4fd; border-radius: 8px;">
          <p style="margin: 0; color: #31708f;">
            <strong>Note:</strong> You will receive a reminder 10 minutes before your appointment time.
          </p>
        </div>
      </div>
      <div style="background: #333; color: white; padding: 20px; text-align: center;">
        <p style="margin: 0;">Thank you for choosing GovCare - Tamil Nadu Government Healthcare</p>
        <p style="margin: 5px 0 0 0; font-size: 12px;">This is an automated email, please do not reply.</p>
      </div>
    </div>
  `,

  appointmentAccepted: (patient, doctor, appointment) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #27ae60, #2ecc71); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0;">Appointment Accepted ✅</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">GovCare - Government Healthcare Portal</p>
      </div>
      <div style="padding: 30px; background: #f8f9fa;">
        <h2 style="color: #333;">Great news ${patient.name}!</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          Your appointment with <strong>Dr. ${doctor.name}</strong> has been <strong style="color: #27ae60;">accepted</strong>.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #27ae60;">
          <h3 style="color: #333; margin-top: 0;">Confirmed Appointment:</h3>
          <p><strong>Doctor:</strong> Dr. ${doctor.name}</p>
          <p><strong>Specialization:</strong> ${doctor.specialization}</p>
          <p><strong>Hospital:</strong> ${doctor.hospital}</p>
          <p><strong>Date:</strong> ${moment(appointment.date).format('DD MMMM YYYY')}</p>
          <p><strong>Time:</strong> ${appointment.time}</p>
          <p><strong>Reason:</strong> ${appointment.reason}</p>
          ${appointment.doctorNotes ? `<p><strong>Doctor's Notes:</strong> ${appointment.doctorNotes}</p>` : ''}
          <p style="color: #27ae60; font-weight: bold;">Status: Confirmed ✅</p>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: #d4edda; border-radius: 8px;">
          <p style="margin: 0; color: #155724;">
            <strong>📅 Reminder:</strong> You will receive a reminder email 10 minutes before your appointment time.
          </p>
        </div>
      </div>
      <div style="background: #333; color: white; padding: 20px; text-align: center;">
        <p style="margin: 0;">Thank you for choosing GovCare - Tamil Nadu Government Healthcare</p>
        <p style="margin: 5px 0 0 0; font-size: 12px;">This is an automated email, please do not reply.</p>
      </div>
    </div>
  `,

  appointmentRejected: (patient, doctor, appointment) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #e74c3c, #c0392b); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0;">Appointment Rejected</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">GovCare - Government Healthcare Portal</p>
      </div>
      <div style="padding: 30px; background: #f8f9fa;">
        <h2 style="color: #333;">Hello ${patient.name},</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          Your appointment with <strong>Dr. ${doctor.name}</strong> has been <strong style="color: #e74c3c;">rejected</strong>.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #e74c3c;">
          <h3 style="color: #333; margin-top: 0;">Appointment Details:</h3>
          <p><strong>Doctor:</strong> Dr. ${doctor.name}</p>
          <p><strong>Specialization:</strong> ${doctor.specialization}</p>
          <p><strong>Hospital:</strong> ${doctor.hospital}</p>
          <p><strong>Date:</strong> ${moment(appointment.date).format('DD MMMM YYYY')}</p>
          <p><strong>Time:</strong> ${appointment.time}</p>
          ${appointment.doctorNotes ? `<p><strong>Reason for Rejection:</strong> ${appointment.doctorNotes}</p>` : ''}
          <p style="color: #e74c3c; font-weight: bold;">Status: Rejected</p>
        </div>
        
        <p style="color: #666;">
          We apologize for the inconvenience. Please book another appointment with a different doctor.
        </p>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/doctors" 
             style="background: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Book New Appointment
          </a>
        </div>
      </div>
      <div style="background: #333; color: white; padding: 20px; text-align: center;">
        <p style="margin: 0;">Thank you for choosing GovCare - Tamil Nadu Government Healthcare</p>
        <p style="margin: 5px 0 0 0; font-size: 12px;">This is an automated email, please do not reply.</p>
      </div>
    </div>
  `,

  appointmentReminder: (patient, doctor, appointment) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #f39c12, #e67e22); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0;">⏰ Appointment Reminder</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">GovCare - Government Healthcare Portal</p>
      </div>
      <div style="padding: 30px; background: #f8f9fa;">
        <h2 style="color: #333;">Reminder: ${patient.name}</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          Your appointment with <strong>Dr. ${doctor.name}</strong> is in <strong style="color: #f39c12;">10 minutes</strong>.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f39c12;">
          <h3 style="color: #333; margin-top: 0;">Appointment Details:</h3>
          <p><strong>Doctor:</strong> Dr. ${doctor.name}</p>
          <p><strong>Specialization:</strong> ${doctor.specialization}</p>
          <p><strong>Hospital:</strong> ${doctor.hospital}</p>
          <p><strong>Date:</strong> ${moment(appointment.date).format('DD MMMM YYYY')}</p>
          <p><strong>Time:</strong> ${appointment.time}</p>
          <p><strong>Reason:</strong> ${appointment.reason}</p>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: #fff3cd; border-radius: 8px;">
          <p style="margin: 0; color: #856404;">
            <strong>Please arrive on time for your appointment.</strong>
          </p>
        </div>
      </div>
      <div style="background: #333; color: white; padding: 20px; text-align: center;">
        <p style="margin: 0;">Thank you for choosing GovCare - Tamil Nadu Government Healthcare</p>
        <p style="margin: 5px 0 0 0; font-size: 12px;">This is an automated reminder email.</p>
      </div>
    </div>
  `
};

// Email sending function - ALWAYS from govcareapp@gmail.com
const sendEmail = async (to, subject, html) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('GovCare email credentials not configured. Skipping email send.');
      return { success: false, message: 'Email not configured' };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'GovCare <govcareapp@gmail.com>',
      to: to,
      subject: subject,
      html: html
    };

    console.log(`Sending email from: govcareapp@gmail.com to: ${to}`);
    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully from GovCare to ${to}`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending email from GovCare:', error);
    return { success: false, error: error.message };
  }
};

// Specific email functions
const sendWelcomePatientEmail = async (user) => {
  const subject = 'Welcome to GovCare - Patient Account Created';
  const html = emailTemplates.welcomePatient(user);
  return await sendEmail(user.email, subject, html);
};

const sendWelcomeDoctorEmail = async (user) => {
  const subject = 'Welcome to GovCare - Doctor Account Created';
  const html = emailTemplates.welcomeDoctor(user);
  return await sendEmail(user.email, subject, html);
};

const sendAppointmentBookedEmail = async (patient, doctor, appointment) => {
  const subject = 'Appointment Booked Successfully - GovCare';
  const html = emailTemplates.appointmentBooked(patient, doctor, appointment);
  return await sendEmail(patient.email, subject, html);
};

const sendAppointmentAcceptedEmail = async (patient, doctor, appointment) => {
  const subject = 'Appointment Accepted - GovCare';
  const html = emailTemplates.appointmentAccepted(patient, doctor, appointment);
  return await sendEmail(patient.email, subject, html);
};

const sendAppointmentRejectedEmail = async (patient, doctor, appointment) => {
  const subject = 'Appointment Rejected - GovCare';
  const html = emailTemplates.appointmentRejected(patient, doctor, appointment);
  return await sendEmail(patient.email, subject, html);
};

const sendAppointmentReminderEmail = async (patient, doctor, appointment) => {
  const subject = '⏰ Appointment Reminder - 10 Minutes Left - GovCare';
  const html = emailTemplates.appointmentReminder(patient, doctor, appointment);
  return await sendEmail(patient.email, subject, html);
};

module.exports = {
  sendWelcomePatientEmail,
  sendWelcomeDoctorEmail,
  sendAppointmentBookedEmail,
  sendAppointmentAcceptedEmail,
  sendAppointmentRejectedEmail,
  sendAppointmentReminderEmail,
  sendEmail
};