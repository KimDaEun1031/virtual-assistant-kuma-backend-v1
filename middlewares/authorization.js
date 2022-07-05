const jwt = require("jsonwebtoken");

const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  const verifier = req.headers.authorization.split(" ")[0];
  const token = req.headers.authorization.split(" ")[1];

  if (verifier === "Bearer" && token) {
    const { id } = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(id).lean();

    req.body.user = user;

    return next();
  }

  res.json({
    result: "error",
    error: {
      message: "유효하지 않은 접근입니다.",
      status: 400,
    },
  });
});
