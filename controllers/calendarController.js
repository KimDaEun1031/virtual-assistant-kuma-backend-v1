/* eslint-disable camelcase */
const google = require("@googleapis/calendar");

const catchAsync = require("../utils/catchAsync");
const credentials = require("../google.json");

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar.events.readonly",
  "https://www.googleapis.com/auth/calendar.events"
];

const {
  client_secret,
  client_id,
  redirect_uris
} = credentials.web;

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[2]
);

exports.googleCalendarAuth = catchAsync((req, res, next) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  res.redirect(authUrl);
});

exports.getTodayEvent = catchAsync((req, res, next) => {
  const { code } = req.query;

  const startDate = new Date();
  const endDate = new Date();

  startDate.setHours(0, 0, 0);
  endDate.setHours(23, 59, 59);

  oAuth2Client.getToken(code, (err, token) => {
    oAuth2Client.setCredentials(token);

    const calendar = google.calendar({version: "v3", auth: oAuth2Client});

    calendar.events.list({
      calendarId: "primary",
      timeMax: endDate,
      timeMin: startDate,
    }, (err, result) => {
      res.json({
        result: "success",
        todayEvent: result.data.items,
      });
    });
  });
});

exports.createEvent = catchAsync(async (req, res, next) => {
  const { code } = req.query;

  const startDate = new Date();
  const endDate = new Date();

  const sampleRequestBody = {
    "summary": "Calendar Test",
    "start": {
      "dateTime": startDate,
      "timeZone": "Asia/Seoul",
    },
    "end": {
      "dateTime": endDate,
      "timeZone": "Asia/Seoul",
    },
  };

  oAuth2Client.getToken(code, (err, token) => {
    oAuth2Client.setCredentials(token);

    const calendar = google.calendar({version: "v3", auth: oAuth2Client});

    calendar.events.insert({
      calendarId: "primary",
      resource: sampleRequestBody,
    }, (err, result) => {
      if (result.data) {
        res.json({
          result: "success",
        });
      }
    });
  });
});
