/* eslint-disable camelcase */
const google = require("@googleapis/calendar");

const catchAsync = require("../utils/catchAsync");
const credentials = require("../google.json");
const User = require("../models/User");

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
  redirect_uris[3]
);

exports.googleCalendarAuth = catchAsync((req, res, next) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    include_granted_scopes: true,
  });

  if (!authUrl) {
    return res.json({
      result: "error",
      error: {
        message: "Internal Server Error",
        status: 500,
      },
    });
  }

  res.json({
    result: "success",
    authUrl,
  });
});

exports.getToken = catchAsync(async (req, res, next) => {
  const { code } = req.headers;

  if (!code) {
    return res.json({
      result: "error",
      error: {
        message: "No Code",
        status: 400,
      },
    });
  }

  const { tokens } = await oAuth2Client.getToken(code);

  if (!tokens) {
    return res.json({
      result: "error",
      error: {
        message: "No Token",
        status: 400,
      },
    });
  }

  oAuth2Client.setCredentials(tokens);

  res.json({
    result: "success",
    tokens,
  });
});

exports.getTodayEvent = catchAsync(async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.json({
      result: "error",
      error: {
        message: "No Token",
        status: 400,
      },
    });
  }

  const parseToken = JSON.parse(token);

  const getUser = async (email) => {
    let user = await User.findOne({ email }).lean();
    const name = user.email.split("@")[0];

    if (!user) {
      user = await User.create({
        name,
        email,
      });
    }

    return user;
  };

  const startDate = new Date();
  const endDate = new Date();

  startDate.setHours(0, 0, 0);
  endDate.setHours(23, 59, 59);

  oAuth2Client.setCredentials(parseToken);

  const calendar = google.calendar({version: "v3", auth: oAuth2Client});
  const calendarOptions = {
    calendarId: "primary",
    timeMax: endDate,
    timeMin: startDate,
  };

  calendar.events.list(calendarOptions, async (err, result) => {
    if (err) {
      next(err);
    }

    const user = await getUser(result.data.summary);

    if (!result.data.items) {
      return res.json({
        result: "error",
        error: {
          message: "No Calendar Data",
          status: 400,
        },
      });
    }

    res.json({
      result: "success",
      user,
      todayEvents: result.data.items
    });
  });

});

exports.createEvent = catchAsync(async (req, res, next) => {
  const { summary, date } = req.body;
  const { token } = req.headers;

  if (!token) {
    return res.json({
      result: "error",
      error: {
        message: "No Token",
        status: 400,
      },
    });
  }

  const parseToken = JSON.parse(token);
  const dateTime = new Date(date).toISOString();

  const sampleRequestBody = {
    "summary": summary,
    "start": {
      "dateTime": dateTime,
      "timeZone": "Asia/Seoul",
    },
    "end": {
      "dateTime": dateTime,
      "timeZone": "Asia/Seoul",
    },
  };

  oAuth2Client.setCredentials(parseToken);

  const calendar = google.calendar({version: "v3", auth: oAuth2Client});
  const calendarOptions = {
    calendarId: "primary",
    resource: sampleRequestBody,
  };

  const result = await calendar.events.insert(calendarOptions);

  if (!result.data) {
    return res.json({
      result: "error",
      error: {
        message: "No Calendar Data",
        status: 400,
      },
    });
  }

  res.json({
    result: "success",
  });
});
