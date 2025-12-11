const express = require("express");
const appointmentController = require("../controller/appointmentController");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

// Protect all routes (User must be logged in)
router.use(isAuthenticated);

router.get("/", appointmentController.getMyAppointments);
router.post("/", appointmentController.createAppointment);

module.exports = router;