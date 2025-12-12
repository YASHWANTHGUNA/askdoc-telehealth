const mongoose = require("mongoose");

const medicalSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  condition: { type: String, required: true },
  description: String,
  date: { type: Date, default: Date.now }
});

const MedicalHistory = mongoose.model("MedicalHistory", medicalSchema);
module.exports = MedicalHistory;