const twilio = require("twilio");

let client = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

exports.sendSMS = async (to, body) => {
  if (!client) {
    console.log(`[SMS fallback] To: ${to} | ${body}`);
    return Promise.resolve();
  }
  return client.messages.create({
    body,
    from: process.env.TWILIO_PHONE_NUMBER,
    to
  });
};
