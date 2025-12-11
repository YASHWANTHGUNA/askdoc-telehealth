const { StreamChat } = require("stream-chat");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getToken = catchAsync(async (req, res, next) => {
  // 1. Initialize the Server Client
  const serverClient = StreamChat.getInstance(
    process.env.STREAM_API_KEY,
    process.env.STREAM_API_SECRET
  );

  // 2. Get the current user's ID (from the middleware)
  const userId = req.user.id;

  if (!userId) {
    return next(new AppError("User ID is missing", 400));
  }

  // 3. Generate the token
  const token = serverClient.createToken(userId);

  // 4. Send it back
  res.status(200).json({
    status: "success",
    token,
    user: {
        id: userId,
        name: req.user.name,
        image: req.user.image || `https://getstream.io/random_png/?name=${req.user.name}`
    }
  });
});