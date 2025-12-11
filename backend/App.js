const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Import Routers
const userRouter = require("./routes/userRouter");
const streamRouter = require("./routes/streamRouter");
const appointmentRouter = require("./routes/appointmentRouter"); // ✅ Valid Import

// Import Error Controller (Make sure you have this form the auth setup)
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://askdoc-telehealth.vercel.app", // ❌ Remove the '/' at the end
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/stream", streamRouter);
app.use("/api/v1/appointments", appointmentRouter); // ✅ Route Mounted

// A simple route for the homepage
app.get("/", (req, res) => {
  res.status(200).send("Telehealth API is running successfully! 🚀");
});

// 1. Handle Unhandled Routes (404)
// Use '/*' so path-to-regexp parses the wildcard correctly
app.all(/(.*)/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 2. Global Error Handler (Converts errors to JSON)
app.use(globalErrorHandler);

module.exports = app;
