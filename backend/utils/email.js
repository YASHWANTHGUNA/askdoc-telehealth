const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter (Using Port 587 to avoid Timeouts)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    // Fix for some cloud environments
    tls: {
      ciphers: 'SSLv3'
    }
  });

  // 2. Define the email options
  const mailOptions = {
    from: `Telehealth App <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  // 3. Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;