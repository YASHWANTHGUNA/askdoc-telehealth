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
  // 1. Fetch all appointments for the logged-in doctor
  const appointments = await Appointment.find({
    doctorId: req.user.id,
  });

  // 2. Calculate Unique Patients
  const uniquePatients = new Set(
    appointments.map((appt) => appt.patientId?.toString() || "")
  ).size;

  // 3. Calculate Upcoming Appointments
  const upcomingAppointments = appointments.filter(
    (appt) => appt.status === "upcoming"
  ).length;

  // 4. Calculate Today's Appointments
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const todaysAppointments = appointments.filter((appt) => {
    const apptDate = new Date(appt.date);
    return apptDate >= startOfToday && apptDate <= endOfToday;
  }).length;

  // 5. Send the expanded stats back to the frontend
  res.status(200).json({
    status: "success",
    data: {
      totalPatients: uniquePatients,
      totalAppointments: appointments.length,
      todaysAppointments: todaysAppointments,
      upcomingAppointments: upcomingAppointments,
    },
  });
}); 

// ======================================
// 👇 NEW: DOCTOR: SAVE CLINICAL NOTES
// ======================================

exports.updateNotes = catchAsync(async (req, res, next) => {
  const { appointmentId } = req.params;
  const { notes } = req.body;

  const appointment = await Appointment.findOneAndUpdate(
    {
      _id: appointmentId,
      // Optional extra security: ensure the doctor updating notes actually owns this appointment
      // doctorId: req.user.id, 
    },
    { notes },
    {
      new: true, // Returns the updated document
      runValidators: true,
    }
  );

  if (!appointment) {
    return next(new AppError("Appointment not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: appointment,
  });
});