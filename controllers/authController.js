const jwt = require("jsonwebtoken");

const { firebaseAdminAuth } = require("../config/firebase");
const { option, secretKey } = require("../config/secretkey");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");

exports.login = catchAsync(async (req, res, next) => {
  const idToken = req.headers.authorization.split(" ")[1];
  const verifiedToken = await firebaseAdminAuth.verifyIdToken(idToken);

  if (!verifiedToken || !idToken) {
    return res.json({
      result: "error",
      error: {
        message: "Unauthorized",
        status: 401,
      },
    });
  }

  const { email, name } = verifiedToken;
  let user = await User.findOne({ email }).lean();

  if (!user) {
    user = await User.create({
      name,
      email,
    });
  }

  const accessToken = jwt.sign({ id: user._id }, secretKey, option);

  res.json({
    result: "success",
    token: accessToken,
  });
});
