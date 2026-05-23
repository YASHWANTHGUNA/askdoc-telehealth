const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  doctorId: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  doctorName: { type: String, required: true },
  specialty: String,
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ["upcoming", "completed"], default: "upcoming" },
  
  // 👇 NEW: Field to store the doctor's clinical notes
  notes: { type: String, default: "" } 
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;