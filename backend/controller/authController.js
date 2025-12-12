const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const sendEmail = require("../utils/email");

// Helper: Create JWT Token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Helper: Send Token Response
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined; // Remove password from output

  // Check for Stream Token (if you added video)
  let streamToken = "";
  if (process.env.VITE_STREAM_API_KEY) {
    // Basic placeholder or generation logic if you have Stream installed in backend
    // For now, we leave it empty or mock it if needed
  }

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
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
      phone: req.body.phone,     // Added for Profile
      address: req.body.address, // Added for Profile
      gender: req.body.gender,   // Added for Profile
      dob: req.body.dob,         // Added for Profile
    });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    newUser.otp = otp;
    newUser.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    await newUser.save({ validateBeforeSave: false });

    // Send Email (Bypass Mode)
    const message = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Welcome to AskDoc!</h2>
        <p>Your verification code is:</p>
        <h1 style="color: #2563EB; letter-spacing: 5px;">${otp}</h1>
        <p>This code is valid for 10 minutes.</p>
      </div>
    `;

    try {
      await sendEmail({
        email: newUser.email,
        subject: "Your Telehealth App Verification Code",
        html: message,
      });

      res.status(200).json({
        status: "success",
        message: "OTP sent to email successfully!",
      });
    } catch (err) {
      newUser.otp = undefined;
      newUser.otpExpires = undefined;
      await newUser.save({ validateBeforeSave: false });
      return res.status(500).json({
        status: "error",
        message: "There was an error sending the email. Try again later!",
      });
    }
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
    // Find user with this email and OTP, and check if OTP is not expired
    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid OTP or OTP has expired",
      });
    }

    // Verify user
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // Log them in immediately
    const token = signToken(user._id);
    res.status(200).json({
      status: "success",
      token,
      data: { user },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// 3. LOGIN
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password!",
      });
    }

    // 2. Check if user exists && password is correct
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password",
      });
    }

    // 3. Check if Verified
    if (!user.isVerified) {
      return res.status(401).json({
        status: "fail",
        message: "You are not verified! Please sign up again to verify.",
      });
    }

    // 4. Send Token
    const token = signToken(user._id);

    // Stream Token Logic (Mocked logic from your streamController if needed, or simple pass)
    // For simplicity, we just send the user token. The frontend context handles the rest.
    
    res.status(200).json({
      status: "success",
      token,
      user, // Send user details
      // You can add streamToken here if you imported the stream logic
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};