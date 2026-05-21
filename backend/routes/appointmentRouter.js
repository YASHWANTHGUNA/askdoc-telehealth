const express = require("express");
const appointmentController = require("../controller/appointmentController");
const isAuthenticated = require("../middlewares/isAuthenticated");
const restrictTo = require("../middlewares/restrictTo");

const router = express.Router();

router.use(isAuthenticated);

// ==============================
// PATIENT ROUTES
// ==============================
router.post("/book", restrictTo("patient"), appointmentController.createAppointment);
router.get("/my-appointments", restrictTo("patient"), appointmentController.getMyAppointments);

// ==============================
// DOCTOR ROUTES
// ==============================
router.get("/", restrictTo("doctor"), appointmentController.getDoctorAppointments);
router.patch("/:appointmentId/status", restrictTo("doctor"), appointmentController.updateAppointmentStatus);
router.get("/doctor-stats", restrictTo("doctor"), appointmentController.getDoctorStats);

// 👇 NEW: Route specifically for saving clinical notes
router.patch("/:appointmentId/notes", restrictTo("doctor"), appointmentController.updateNotes);

module.exports = router;