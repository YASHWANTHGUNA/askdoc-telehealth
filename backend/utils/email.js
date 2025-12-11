const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.HOST_EMAIL,
      pass: process.env.EMAIL_PASS
    }
  });

  // 2. Define the email options
  const mailOptions = {
    from: `Telehealth App <${process.env.HOST_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  // 3. Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;