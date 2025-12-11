const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");
const jwt = require("jsonwebtoken");
const { StreamChat } = require("stream-chat"); // <--- Added Import

// Helper to create JWT Token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// SIGNUP FUNCTION
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  newUser.otp = otp;
  newUser.otpExpires = Date.now() + 10 * 60 * 1000; 
  await newUser.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: newUser.email,
      subject: 'Your Telehealth App Verification Code',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Welcome to AskDoc!</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #2563EB; letter-spacing: 5px;">${otp}</h1>
          <p>This code is valid for 10 minutes.</p>
        </div>
      `
    });

    res.status(200).json({
      status: 'success',
      message: 'OTP sent to email successfully!',
    });

  } catch (err) {
    newUser.otp = undefined;
    newUser.otpExpires = undefined;
    await newUser.save({ validateBeforeSave: false });

    return next(new AppError('There was an error sending the email. Try again later!'), 500);
  }
});

// VERIFY ACCOUNT FUNCTION
exports.verifyAccount = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new AppError("Email and OTP are required", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("No user found with this email", 404));
  }

  if (user.otp !== otp) {
    return next(new AppError("Invalid OTP", 400));
  }

  if (Date.now() > user.otpExpires) {
    return next(new AppError("OTP has expired. Please request a new OTP.", 400));
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  
  await user.save({ validateBeforeSave: false });

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    message: "Email has been verified",
    token,
    data: {
      user,
    },
  });
});

// LOGIN FUNCTION (UPDATED)
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check input
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  // 2. Find user & check password
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3. Check verification
  if (!user.isVerified) {
    return next(new AppError("You are not verified! Please check your email.", 401));
  }

  // 4. Generate JWT (For Backend Access)
  const token = signToken(user._id);

  // 5. Generate Stream Token (For Video Access) <--- NEW PART
  const serverClient = StreamChat.getInstance(
    process.env.STREAM_API_KEY,
    process.env.STREAM_API_SECRET
  );
  const streamToken = serverClient.createToken(user._id.toString());

  // 6. Send Cookie
  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  res.cookie("jwt", token, cookieOptions);

  // 7. Send Response with BOTH tokens
  res.status(200).json({
    status: "success",
    token,         
    streamToken,    // <--- Sending this to frontend
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
    },
  });
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};