const Appointment = require("../models/appointmentModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// ======================================
// PATIENT: GET OWN APPOINTMENTS
// ======================================

exports.getMyAppointments = catchAsync(async (req, res, next) => {
  const appointments = await Appointment.find({
    patientId: req.user.id,
  }).sort({ date: -1 });

  res.status(200).json({
    status: "success",
    results: appointments.length,
    data: appointments,
  });
});

// ======================================
// PATIENT: CREATE APPOINTMENT
// ======================================

exports.createAppointment = catchAsync(async (req, res, next) => {
  const newAppointment = await Appointment.create({
    patientId: req.user.id, // 🔒 NEVER trust frontend IDs
    doctorId: req.body.doctorId,
    doctorName: req.body.doctorName,
    specialty: req.body.specialty,
    date: req.body.date || Date.now(),
    status: "upcoming",
  });

  res.status(201).json({
    status: "success",
    data: newAppointment,
  });
});

// ======================================
// DOCTOR: GET OWN APPOINTMENTS
// ======================================

exports.getDoctorAppointments = catchAsync(async (req, res, next) => {
  const appointments = await Appointment.find({
    doctorId: req.user.id,
  })
    .populate("patientId", "name email photo")
    .sort({ date: -1 });

  res.status(200).json({
    status: "success",
    results: appointments.length,
    data: appointments,
  });
});

// ======================================
// DOCTOR: UPDATE STATUS
// ======================================

exports.updateAppointmentStatus = catchAsync(async (req, res, next) => {
  const { appointmentId } = req.params;
  const { status } = req.body;

  if (!status) {
    return next(new AppError("Please provide appointment status", 400));
  }

  const appointment = await Appointment.findOneAndUpdate(
    {
      _id: appointmentId,
      doctorId: req.user.id, // 🔒 doctor can update ONLY own appointments
    },
    { status },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!appointment) {
    return next(
      new AppError("Appointment not found or unauthorized", 404)
    );
  }

  res.status(200).json({
    status: "success",
    data: appointment,
  });
});

// ======================================
// DOCTOR: DASHBOARD STATS
// ======================================

exports.getDoctorStats = catchAsync(async (req, res, next) => {
  const appointments = await Appointment.find({
    doctorId: req.user.id,
  });

  const uniquePatients = new Set(
    appointments.map((appt) => appt.patientId.toString())
  ).size;

  res.status(200).json({
    status: "success",
    data: {
      patients: uniquePatients,
      appointments: appointments.length,
      videoSessions: appointments.length,
    },
  });
});