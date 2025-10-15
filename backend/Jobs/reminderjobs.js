const cron = require("node-cron");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const mailer = require("../services/mailer");
const sms = require("../services/sms");
const moment = require("moment-timezone");

// run every minute
const startReminderJob = () => {
  const tz = process.env.TZ || "Asia/Kolkata";
  cron.schedule("* * * * *", async () => {
    try {
      const now = moment.tz(tz);
      // find accepted appointments where reminder not sent
      const appts = await Appointment.find({ status: "accepted", reminderSent: false });
      for (const a of appts) {
        // combine date+time into a moment in tz
        const apptMoment = moment.tz(`${a.date} ${a.time}`, "YYYY-MM-DD HH:mm", tz);
        const diffMinutes = apptMoment.diff(now, "minutes");
        // send reminder if appointment is in the next 10 minutes (>=0 and <=10)
        if (diffMinutes <= 10 && diffMinutes >= 0) {
          const patient = await User.findById(a.patientId);
          const doctor = await User.findById(a.doctorId);
          const subject = `Reminder: Appointment with Dr. ${doctor.name}`;
          const text = `Reminder: You have an appointment with Dr. ${doctor.name} at ${a.time} on ${a.date}.`;
          await mailer.sendMail(patient.email, subject, text).catch(console.error);
          await sms.sendSMS(patient.phone, `Reminder: Appointment with Dr. ${doctor.name} at ${a.time} on ${a.date}`).catch(console.error);

          a.reminderSent = true;
          await a.save();
          console.log(`Reminder sent for appointment ${a._id}`);
        }
      }
    } catch (err) {
      console.error("Reminder job error:", err);
    }
  }, { timezone: tz });
};

module.exports = startReminderJob;
