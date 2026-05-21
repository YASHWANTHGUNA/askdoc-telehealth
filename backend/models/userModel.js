const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  role: {
    type: String,
    enum: ["patient", "doctor"],
    default: "patient",
  },
  phone: String,
  address: String,
  gender: String,
  dob: Date,
  bloodGroup: String,
  height: String,
  weight: String,
  medicalBio: String,
  photo: {
    type: String,
    default: "default" 
  },
  // Doctor Fields
  specialty: String,
  experience: String,
  consultationFee: Number,
  aboutDoctor: String,
  
  // 👇 NEW: Availability Fields
  availableDays: { 
    type: [String], 
    default: [] 
  },
  startTime: { 
    type: String, 
    default: "09:00" 
  },
  endTime: { 
    type: String, 
    default: "17:00" 
  },

  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: String,
  otpExpires: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;