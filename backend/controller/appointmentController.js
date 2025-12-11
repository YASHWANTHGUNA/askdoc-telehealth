const Appointment = require("../models/appointmentModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// 1. Get All Appointments for the logged-in user
exports.getMyAppointments = catchAsync(async (req, res, next) => {
  // Find appointments where I am either the patient OR the doctor
  const appointments = await Appointment.find({
    $or: [{ patient: req.user.id }, { doctor: req.user.id }],
  }).populate({
    path: "patient",
    select: "name email image",
  }).populate({
    path: "doctor",
    select: "name email image",
  });

  res.status(200).json({
    status: "success",
    results: appointments.length,
    data: {
      appointments,
    },
  });
});

// 2. Create a Dummy Appointment (For testing)
exports.createAppointment = catchAsync(async (req, res, next) => {
  const newAppointment = await Appointment.create({
    patient: req.user.id,        // The person logged in
    doctor: req.user.id,         // For testing, assign to self (or hardcode another ID)
    date: req.body.date || Date.now(),
    reason: req.body.reason || "General Checkup",
  });

  res.status(201).json({
    status: "success",
    data: {
      appointment: newAppointment,
    },
  });
});