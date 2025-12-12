const express = require("express");
const Appointment = require("../models/appointmentModel");
const router = express.Router();

// BOOK APPOINTMENT
router.post("/book", async (req, res) => {
  try {
    const newAppointment = await Appointment.create(req.body);
    res.status(201).json({ status: "success", data: newAppointment });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
});

// GET MY APPOINTMENTS
router.get("/my-appointments/:userId", async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.userId });
    res.status(200).json({ status: "success", data: appointments });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
});

module.exports = router;