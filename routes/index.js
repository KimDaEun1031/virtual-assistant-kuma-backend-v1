const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middlewares/authorization");
const { login } = require("../controllers/authController");
const { updateUser } = require("../controllers/userController");

router.get("/", (req, res, next) => {
  res.json({ message: "welcome"});
});

router.post("/login", login);
router.patch("/user", isLoggedIn, updateUser);

module.exports = router;
