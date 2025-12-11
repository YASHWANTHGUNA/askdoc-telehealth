// 🛑 BYPASS MODE: No real email sending
const sendEmail = async (options) => {
  console.log("============================================");
  console.log("📧 EMAIL SYSTEM (BYPASS MODE) 📧");
  console.log(`To: ${options.email}`);
  console.log(`Subject: ${options.subject}`);
  console.log("--------------------------------------------");
  console.log("👇 HERE IS YOUR CONTENT (LOOK FOR THE OTP):");
  console.log(options.html); 
  console.log("============================================");

  // Return a resolved promise so the app thinks it worked
  return Promise.resolve();
};

module.exports = sendEmail;