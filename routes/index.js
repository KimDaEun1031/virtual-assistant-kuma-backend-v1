const express = require("express");
const router = express.Router();

const { login } = require("../controllers/authController");

router.get("/", (req, res, next) => {
  res.json({ message: "welcome"});
});

router.post("/login", login);

module.exports = router;
