const express = require("express");
const router = express.Router();

const {
  getTodayEvent,
  createEvent,
  googleCalendarAuth,
  getToken,
} = require("../controllers/calendarController");

router.get("/auth", googleCalendarAuth);
router.get("/token", getToken);
router.get("/event", getTodayEvent);
router.post("/event", createEvent);

module.exports = router;
