const multer = require("multer");
const AppError = require("../utils/appError");

// ======================================
// MEMORY STORAGE
// ======================================
// Files stay in memory temporarily
// before uploading to Cloudinary

const multerStorage = multer.memoryStorage();

// ======================================
// FILE FILTER
// ======================================

const multerFilter = (req, file, cb) => {
  // Allow only image files
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      new AppError("Only image files are allowed", 400),
      false
    );
  }
};

// ======================================
// MULTER CONFIG
// ======================================

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,

  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

module.exports = upload;
