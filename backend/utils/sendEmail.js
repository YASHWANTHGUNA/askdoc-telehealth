const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTP = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'AskDoc+ <onboarding@resend.dev>',
      to: email, 
      subject: 'Verify your AskDoc+ Account',
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #2563eb; text-align: center;">AskDoc+</h2>
          <p>Hello,</p>
          <p>Thank you for joining AskDoc+. Use the verification code below to complete your registration:</p>
          <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1f2937;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #6b7280; margin-top: 20px;">This code expires in 10 minutes. If you didn't request this, please ignore this email.</p>
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
