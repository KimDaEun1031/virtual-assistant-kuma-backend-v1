const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");

exports.updateUser = catchAsync(async (req, res, next) => {
  const { name, character, user } = req.body;

  if (!name || !character) {
    return res.json({
      result: "error",
      error: {
        message: "Bad Request",
        status: 400,
      },
    });
  }

  const updateUser = await User.findByIdAndUpdate(
    { _id: user._id },
    { name, character },
    { new: true }
  );

  if (!updateUser) {
    return res.json({
      result: "error",
      error: {
        message: "Internal Server Error",
        status: 500,
      },
    });
  }

  res.json({
    result: "success",
    user: updateUser,
  });
});
