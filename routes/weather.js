const express = require("express");
const router = express.Router();

const { getWeatherInfo } = require("../controllers/weatherController");

router.get("/", getWeatherInfo);

module.exports = router;
