const express = require("express");
const authController = require("../controller/authController");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/verifyOTP", authController.verifyAccount);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// Protected routes
router.use(isAuthenticated);

router.get("/me", (req, res) => {
    res.status(200).json({
        status: "success",
        data: {
            user: req.user,
        },
    });
});

router.get("/doctors-only", authController.restrictTo('doctor'), (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Welcome, Doctor!",
    });
});


module.exports = router;