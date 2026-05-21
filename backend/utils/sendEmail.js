const { Resend } = require("resend");

let resend = null;

// SAFELY initialize Resend
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  console.warn("⚠️ RESEND_API_KEY missing.");
}

const sendOTP = async (email, otp) => {
  try {
    // Prevent crashes if API key missing
    if (!resend) {
      console.warn("⚠️ Resend not initialized.");
      return { success: false };
    }

    const { data, error } = await resend.emails.send({
      from: "AskDoc+ <onboarding@resend.dev>",
      to: email,
      subject: "Verify your AskDoc+ Account",
      html: `
        <div style="font-family: sans-serif;">
          <h2>AskDoc+</h2>
          <p>Your OTP is:</p>
          <h1>${otp}</h1>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return { success: false, error };
    }

    return { success: true, data };

  } catch (error) {
    console.error("Resend Error:", error);
    return { success: false, error };
  }
};

module.exports = { sendOTP };