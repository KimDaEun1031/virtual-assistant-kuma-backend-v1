const jwt = require("jsonwebtoken");

const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (token) {
    const { id } = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(id).lean();

    req.body.user = user;

    return next();
  }

  res.json({
    result: "error",
    error: {
      message: "Unauthorized",
      status: 401,
    },
  });
});
