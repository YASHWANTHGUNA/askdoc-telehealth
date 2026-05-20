const express = require("express");
const MedicalHistory = require("../models/medicalModel");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

// 🔒 Protect all medical routes
router.use(isAuthenticated);

// ======================================
// GET LOGGED-IN USER MEDICAL HISTORY
// ======================================

router.get("/", async (req, res) => {
  try {
    const history = await MedicalHistory.find({
      patientId: req.user.id,
    }).sort({ date: -1 });

    res.status(200).json({
      status: "success",
      data: history,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
});

// ======================================
// ADD MEDICAL RECORD
// ======================================

router.post("/", async (req, res) => {
  try {
    const newRecord = await MedicalHistory.create({
      patientId: req.user.id, // 🔒 NEVER trust frontend patientId
      condition: req.body.condition,
      description: req.body.description,
      date: req.body.date || Date.now(),
    });

    res.status(201).json({
      status: "success",
      data: newRecord,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
});

module.exports = router;