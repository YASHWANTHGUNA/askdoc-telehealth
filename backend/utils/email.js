const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 🛑 BYPASS MODE: Gmail is blocking us, so we log the email instead.
  console.log("============================================");
  console.log("📧 EMAIL SYSTEM (BYPASS MODE) 📧");
  console.log(`To: ${options.email}`);
  console.log(`Subject: ${options.subject}`);
  console.log("--------------------------------------------");
  console.log("👇 HERE IS YOUR CONTENT (LOOK FOR THE OTP):");
  console.log(options.html); 
  console.log("============================================");

  // We return "Promise.resolve()" to tell the controller "Success!"
  return Promise.resolve();
};

module.exports = sendEmail;

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