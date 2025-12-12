const express = require("express");
const authController = require("../controller/authController");
const User = require("../models/userModel"); // Import User model
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/verifyOTP", authController.verifyOTP);
router.post("/login", authController.login);

// 👇 NEW: UPDATE PROFILE ROUTE
router.patch("/update-profile", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.body.userId, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ status: "success", data: updatedUser });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
});

module.exports = router;