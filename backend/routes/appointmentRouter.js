const express = require("express");
const appointmentController = require("../controller/appointmentController");
const isAuthenticated = require("../middlewares/isAuthenticated");
const restrictTo = require("../middlewares/restrictTo");

const router = express.Router();

// 🔒 Protect ALL appointment routes
router.use(isAuthenticated);

// ==============================
// PATIENT ROUTES
// ==============================

// Book appointment securely
router.post(
  "/book",
  restrictTo("patient"),
  appointmentController.createAppointment
);

// Get logged-in patient's appointments
router.get(
  "/my-appointments",
  restrictTo("patient"),
  appointmentController.getMyAppointments
);

// ==============================
// DOCTOR ROUTES
// ==============================

// Get doctor's own appointments
router.get(
  "/",
  restrictTo("doctor"),
  appointmentController.getDoctorAppointments
);

// Update appointment status
router.patch(
  "/:appointmentId/status",
  restrictTo("doctor"),
  appointmentController.updateAppointmentStatus
);

// Doctor dashboard statistics
router.get(
  "/doctor-stats",
  restrictTo("doctor"),
  appointmentController.getDoctorStats
);

module.exports = router;