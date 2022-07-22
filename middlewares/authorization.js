const jwt = require("jsonwebtoken");

const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email }).lean();

  req.body.user = user;

  return next();
});
