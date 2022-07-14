"use strict";

const dialogflow = require("@google-cloud/dialogflow");
const catchAsync = require("../utils/catchAsync");

exports.detectIntents = catchAsync(async (req, res, next) => {
  const { text } = req.body;

  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.projectAgentSessionPath(
    "dialogflow-test-354510",
    "chatbot-test"
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: text,
        languageCode: "ko",
      },
    },
  };

  const responses = await sessionClient.detectIntent(request);

  if (responses[0].queryResult) {
    res.json({
      result: "success",
      answer: responses[0].queryResult.fulfillmentText,
    });
  }
});
