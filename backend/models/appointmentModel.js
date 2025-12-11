const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Appointment must belong to a patient"],
  },
  doctor: {
    type: mongoose.Schema.ObjectId, // In a real app, this points to a Doctor ID
    ref: "User", 
    required: [true, "Appointment must have a doctor"],
  },
  date: {
    type: Date,
    required: [true, "Appointment must have a date"],
  },
  reason: {
    type: String,
    required: [true, "Appointment must have a reason"],
  },
  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled"],
    default: "scheduled",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});



const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;