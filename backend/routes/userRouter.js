// backend/routes/userRouter.js

const express = require("express");
const authController = require("../controller/authController");
const isAuthenticated = require("../middlewares/isAuthenticated"); // add this import
const User = require("../models/userModel");
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/verifyOTP", authController.verifyOTP);
router.post("/login", authController.login);

// Protected — user must be logged in, ID comes from token not body
router.patch("/update-profile", isAuthenticated, async (req, res) => {
  try {
    // Remove any attempt to change role or password through this route
    const { password, passwordConfirm, role, ...safeFields } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, // ← from the verified JWT, not the request body
      safeFields,
      { new: true, runValidators: true }
    );
    res.status(200).json({ status: "success", data: updatedUser });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
});

router.get("/doctors", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" });
    res.status(200).json({ status: "success", data: doctors });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
});

module.exports = router;