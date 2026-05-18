const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { sendOTP } = require("../utils/sendEmail");
const { StreamChat } = require("stream-chat"); // Import StreamChat

// Get Environment Variables for Stream
const STREAM_API_KEY = process.env.STREAM_API_KEY; 
// 👇 CRITICAL FIX: Use STREAM_API_SECRET to match Render's Environment
const STREAM_SECRET = process.env.STREAM_API_SECRET; 

// Initialize StreamChat client (only if keys exist)
let streamChat = null;
if (STREAM_API_KEY && STREAM_SECRET) {
  // This will now correctly initialize because the variable names match the environment
  streamChat = new StreamChat(STREAM_API_KEY, STREAM_SECRET);
}

// Helper: Create JWT Token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// 1. SIGNUP
exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: req.body.role,
      phone: req.body.phone,
      address: req.body.address,
      gender: req.body.gender,
      dob: req.body.dob,
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    newUser.otp = otp;
    newUser.otpExpires = Date.now() + 10 * 60 * 1000;
    await newUser.save({ validateBeforeSave: false });

    const emailResponse = await sendOTP(newUser.email, otp);

    if (!emailResponse.success) {
      newUser.otp = undefined;
      newUser.otpExpires = undefined;
      await newUser.save({ validateBeforeSave: false });
      return res.status(500).json({
        status: "error",
        message: "Failed to send verification email.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "OTP sent to email successfully!",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// 2. VERIFY OTP
exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // MASTER OTP BYPASS for Recruiters/Testing (Must safely convert to string)
    if (String(otp) === "999999") {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ status: "fail", message: "User not found" });
      }
      
      user.isVerified = true;
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save({ validateBeforeSave: false });

      const token = signToken(user._id);
      let streamToken;
      try {
        if (streamChat) streamToken = streamChat.createToken(user.id);
      } catch (e) {
        console.error("Stream Token Generation Failed on Verify:", e);
      }

      return res.status(200).json({
        status: "success",
        token,
        user,
        streamToken,
      });
    }

    // Regular DB verification logic
    let user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ status: "fail", message: "Invalid OTP or OTP has expired" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    const token = signToken(user._id);
    
    // 👇 GENERATE STREAM TOKEN ON SUCCESSFUL VERIFICATION
    let streamToken;
    try {
        if (streamChat) {
            // Using user.id as this is the standard ID the frontend expects after mapping
            streamToken = streamChat.createToken(user.id); 
        }
    } catch (e) {
        console.error("Stream Token Generation Failed on Verify:", e);
    }
    // 👆 END CRITICAL

    res.status(200).json({
      status: "success",
      token,
      user,
      streamToken: streamToken, // ✅ Include token in response
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// 3. LOGIN 
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: "fail", message: "Please provide email and password!" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ status: "fail", message: "Incorrect email or password" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ status: "fail", message: "You are not verified! Please sign up again to verify." });
    }

    const token = signToken(user._id);

    // 👇 GENERATE STREAM TOKEN ON SUCCESSFUL LOGIN
    let streamToken;
    try {
        if (streamChat) {
            // Generates the server-side token for the client to use in the video component
            streamToken = streamChat.createToken(user.id); 
        }
    } catch (e) {
        console.error("Stream Token Generation Failed on Login:", e);
    }
    // 👆 END CRITICAL

    res.status(200).json({
      status: "success",
      token,
      user,
      streamToken: streamToken, // ✅ SEND THE TOKEN TO THE FRONTEND
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};