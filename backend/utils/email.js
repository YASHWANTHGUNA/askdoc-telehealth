const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  console.log("📧 ATTEMPTING EMAIL SEND...");
  console.log(`📧 CONFIG: Host=smtp.gmail.com, Port=587, User=${process.env.EMAIL_USER}`);

  // 1. Create a transporter with Debugging Enabled
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // Standard TLS port
    secure: false, // Must be false for port 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false, // Fix for some cloud SSL issues
      ciphers: 'SSLv3'
    },
    connectionTimeout: 10000, // 10 seconds wait
    logger: true, // Log SMTP traffic
    debug: true   // Include debug info
  });

  // 2. Define the email options
  const mailOptions = {
    from: `Telehealth App <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  // 3. Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ EMAIL SENT SUCCESS:", info.messageId);
  } catch (err) {
    console.error("❌ EMAIL SEND FAILED:", err);
    throw err; // Pass error up so the frontend sees it
  }
};

module.exports = sendEmail;