const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1. Create a transporter — this is the connection to Gmail's SMTP server
  const transporter = nodemailer.createTransport({
    service: "gmail", // tells nodemailer which SMTP settings to use for Gmail
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // the App Password, not your real password
    },
  });

  // 2. Define the email content
  const mailOptions = {
    from: `"AskDoc Health" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  // 3. Actually send it — this is what was missing before
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;