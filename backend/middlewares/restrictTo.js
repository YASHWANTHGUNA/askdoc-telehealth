const AppError = require("../utils/appError");

const restrictTo = (...roles) => {
  return (req, res, next) => {
    // req.user comes from isAuthenticated middleware
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You do not have permission to perform this action",
          403
        )
      );
    }

    next();
  };
};

module.exports = restrictTo;