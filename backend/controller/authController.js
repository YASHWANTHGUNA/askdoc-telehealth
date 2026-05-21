const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { sendOTP } = require("../utils/sendEmail");
const { StreamChat } = require("stream-chat"); 
const catchAsync = require("../utils/catchAsync"); 
const AppError = require("../utils/appError");     

// Get Environment Variables for Stream
const STREAM_API_KEY = process.env.STREAM_API_KEY; 
const STREAM_SECRET = process.env.STREAM_API_SECRET; 

let streamChat = null;
if (STREAM_API_KEY && STREAM_SECRET) {
  streamChat = new StreamChat(STREAM_API_KEY, STREAM_SECRET);
}

// Helper: Create JWT Token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// ======================================
// 1. SIGNUP LAYER (Recruiter & Sandbox Friendly)
// ======================================
exports.signup = catchAsync(async (req, res, next) => {
  // 1. Initialize user memory state instance without writing instantly to DB
  const newUser = new User({
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

  // 2. Generate and assign OTP attributes directly to the instance before saving
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  newUser.otp = otp;
  newUser.otpExpires = Date.now() + 10 * 60 * 1000;

  // 3. Execute a SINGLE atomic database transaction. 
  // This triggers your pre('save') hook exactly ONCE, passing next smoothly!
  await newUser.save();

  // 4. Dispatch verification code to patient email wrapped inside a safety wrapper
  let emailResponse;
  try {
    emailResponse = await sendOTP(newUser.email, otp);
  } catch (mailError) {
    console.error("Mail Transporter Connection Failed:", mailError.message);
    emailResponse = { success: false };
  }

  // 👇 THE RECRUITER BYPASS: Intercept email delivery or free-tier domain constraints
  if (!emailResponse || !emailResponse.success) {
    console.log(`\n=============================================================`);
    console.log(`⚠️  RESEND UNVERIFIED DOMAIN BLOCK INTERCEPTED SECURELY`);
    console.log(`👉 RECRUITER TARGET EMAIL: ${newUser.email}`);
    console.log(`👉 ACTUAL GENERATED OTP  : ${otp}`);
    console.log(`💡 RECRUITER BYPASS TRICK : Use code '999999' on the next screen.`);
    console.log(`=============================================================\n`);

    // Force return a 200 OK success status back to the client anyway!
    // This allows ANY email to pass through without throwing a 500 error screen.
    return res.status(200).json({
      status: "success",
      message: "Account initialization completed successfully! Please verify your identity.",
    });
  }

  // Standard path if testing with your own registered sandbox email account
  res.status(200).json({
    status: "success",
    message: "OTP sent to email successfully!",
  });
});

// ======================================
// 2. VERIFY OTP LAYER
// ======================================
exports.verifyOTP = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;

  // MASTER OTP BYPASS for Recruiters/Testing 
  if (String(otp) === "999999") {
    let user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("User not found", 404));
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
    return next(new AppError("Invalid OTP or OTP has expired", 400));
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save({ validateBeforeSave: false });

  const token = signToken(user._id);
  
  let streamToken;
  try {
      if (streamChat) {
          streamToken = streamChat.createToken(user.id); 
      }
  } catch (e) {
      console.error("Stream Token Generation Failed on Verify:", e);
  }

  res.status(200).json({
    status: "success",
    token,
    user,
    streamToken: streamToken,
  });
});

// ======================================
// 3. LOGIN LAYER
// ======================================
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  if (!user.isVerified) {
    return next(new AppError("You are not verified! Please sign up again to verify.", 401));
  }

  const token = signToken(user._id);

  let streamToken;
  try {
      if (streamChat) {
          streamToken = streamChat.createToken(user.id); 
      }
  } catch (e) {
      console.error("Stream Token Generation Failed on Login:", e);
  }

  res.status(200).json({
    status: "success",
    token,
    user,
    streamToken: streamToken,
  });
});