const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  // If email credentials aren't configured, skip silently (useful in dev)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email not sent - EMAIL_USER/EMAIL_PASS not configured in .env');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
