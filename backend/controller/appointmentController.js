// backend/controller/appointmentController.js — full corrected file

const Appointment = require("../models/appointmentModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Get all appointments for the logged-in patient
exports.getMyAppointments = catchAsync(async (req, res, next) => {
  const appointments = await Appointment.find({
    patientId: req.user.id,  // ← matches the model field name
  });

  res.status(200).json({
    status: "success",
    results: appointments.length,
    data: { appointments },
  });
});

// Book a new appointment
exports.createAppointment = catchAsync(async (req, res, next) => {
  const newAppointment = await Appointment.create({
    patientId: req.user.id,          // ← matches the model
    doctorName: req.body.doctorName, // ← matches the model
    specialty: req.body.specialty,
    date: req.body.date || Date.now(),
  });

  res.status(201).json({
    status: "success",
    data: { appointment: newAppointment },
  });
});