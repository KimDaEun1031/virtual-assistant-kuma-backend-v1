const express = require("express");
const router = express.Router();

const { detectIntents } = require("../controllers/chatController");

router.post("/textQuery", detectIntents);

module.exports = router;
