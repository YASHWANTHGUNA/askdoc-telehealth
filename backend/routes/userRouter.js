// backend/routes/userRouter.js

const express = require("express");
const multer = require("multer"); // Added multer
const cloudinary = require("cloudinary").v2; // Added cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const authController = require("../controller/authController");
const isAuthenticated = require("../middlewares/isAuthenticated"); 
const User = require("../models/userModel");

const router = express.Router();

// Configure Multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/signup", authController.signup);
router.post("/verifyOTP", authController.verifyOTP);
router.post("/login", authController.login);

// Protected — user must be logged in, ID comes from token not body
router.patch(
  "/update-profile",
  isAuthenticated,
  upload.single("image"), // 'upload' is now defined above
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

      // ======================================
      // DEFAULT IMAGE
      // ======================================

      let finalImageUrl = req.user.photo || "default";

      // 👇 NEW: If frontend explicitly sends "default", it means "Remove Picture" was clicked
      if (safeFields.photo === "default") {
        finalImageUrl = "default";
      }

      // ======================================
      // CLOUDINARY IMAGE UPLOAD
      // ======================================

      if (req.file) {
        const uploadStream = () =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream( // 'cloudinary' is now defined
              {
                folder: "askdoc_profiles",

                transformation: [
                  {
                    width: 500,
                    height: 500,
                    crop: "fill",
                    gravity: "face",
                  },
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

      if (
        !safeFields.consultationFee ||
        safeFields.consultationFee === "null"
      ) {
        delete safeFields.consultationFee;
      }

      if (
        !safeFields.experience ||
        safeFields.experience === "null"
      ) {
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