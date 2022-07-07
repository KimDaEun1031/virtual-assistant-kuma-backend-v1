const express = require("express");
const router = express.Router();

const {
  getTodayEvent,
  createEvent,
  googleCalendarAuth,
} = require("../controllers/calendarController");

router.get("/auth", googleCalendarAuth);
router.get("/event", getTodayEvent);
router.get("/insert/event", createEvent);

module.exports = router;
