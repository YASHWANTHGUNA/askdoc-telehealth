const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Import Routers
const userRouter = require("./routes/userRouter");
const streamRouter = require("./routes/streamRouter");
// 👇 NEW IMPORTS
const appointmentRouter = require("./routes/appointmentRouter");
const medicalRouter = require("./routes/medicalRouter");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://askdoc-telehealth.vercel.app"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/stream", streamRouter);
// 👇 NEW ROUTES REGISTERED
app.use("/api/v1/appointments", appointmentRouter);
app.use("/api/v1/medical-history", medicalRouter);

app.get("/", (req, res) => {
  res.status(200).send("Telehealth API is running successfully! 🚀");
});

app.all(/(.*)/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;