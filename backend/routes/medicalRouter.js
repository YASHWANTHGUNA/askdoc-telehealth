const express = require("express");
const MedicalHistory = require("../models/medicalModel");
const router = express.Router();

// GET HISTORY
router.get("/:userId", async (req, res) => {
  try {
    const history = await MedicalHistory.find({ patientId: req.params.userId });
    res.status(200).json({ status: "success", data: history });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
});

// ADD RECORD
router.post("/", async (req, res) => {
  try {
    const newRecord = await MedicalHistory.create(req.body);
    res.status(201).json({ status: "success", data: newRecord });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
});

module.exports = router;