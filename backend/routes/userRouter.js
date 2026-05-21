// backend/routes/userRouter.js

const express = require("express");
const multer = require("multer"); 
const cloudinary = require("cloudinary").v2; 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const authController = require("../controller/authController");
const isAuthenticated = require("../middlewares/isAuthenticated"); 
const User = require("../models/userModel");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/signup", authController.signup);
router.post("/verifyOTP", authController.verifyOTP);
router.post("/login", authController.login);

router.patch(
  "/update-profile",
  isAuthenticated,
  upload.single("image"), 
  async (req, res) => {
    try {
      // ======================================
      // REMOVE SENSITIVE FIELDS
      // ======================================
      const {
        password,
        passwordConfirm,
        role,
        ...safeFields
      } = req.body;

      // 👇 NEW: Parse the availableDays string back into a real Array safely
      if (safeFields.availableDays && typeof safeFields.availableDays === "string") {
        try {
          safeFields.availableDays = JSON.parse(safeFields.availableDays);
        } catch (e) {
          safeFields.availableDays = []; // Fallback if parsing fails
        }
      }

      // ======================================
      // DEFAULT IMAGE
      // ======================================
      let finalImageUrl = req.user.photo || "default";

      if (safeFields.photo === "default") {
        finalImageUrl = "default";
      }

      // ======================================
      // CLOUDINARY IMAGE UPLOAD
      // ======================================
      if (req.file) {
        const uploadStream = () =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream( 
              {
                folder: "askdoc_profiles",
                transformation: [
                  { width: 500, height: 500, crop: "fill", gravity: "face" },
                ],
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
              }
            );
            stream.end(req.file.buffer);
          });

        finalImageUrl = await uploadStream();
      }

      // ======================================
      // CLEAN EMPTY FIELDS
      // ======================================
      if (!safeFields.consultationFee || safeFields.consultationFee === "null") {
        delete safeFields.consultationFee;
      }
      if (!safeFields.experience || safeFields.experience === "null") {
        delete safeFields.experience;
      }

      // ======================================
      // UPDATE USER
      // ======================================
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
          ...safeFields,
          photo: finalImageUrl,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(200).json({
        status: "success",
        data: updatedUser,
      });
    } catch (err) {
      console.error("Profile Update Error:", err);
      res.status(400).json({
        status: "fail",
        message: err.message,
      });
    }
  }
);

router.get("/doctors", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" });
    res.status(200).json({ status: "success", data: doctors });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
});

module.exports = router;