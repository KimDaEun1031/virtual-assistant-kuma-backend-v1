const axios = require("axios");
const catchAsync = require("../utils/catchAsync");
const getSearchTime = require("../utils/getSearchTime");
const weatherFilter = require("../utils/weatherFilter");

process.env.NODE_TLS_REJECT_UNAUTHORIZED="0";

exports.getWeatherInfo = catchAsync(async (req, res, next) => {
  const { baseTime, date } = getSearchTime();

  const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${process.env.WEATHER_API_KEY}&numOfRows=70&pageNo=1&dataType=JSON&base_date=${date}&base_time=${baseTime}&nx=62&ny=119`;
  const result = await axios.get(url);

  if (!result.data.response.body) {
    return res.json({
      result: "error",
      error: {
        message: "Bad Request",
        status: 400,
      },
    });
  }

  const weatherInfo = result.data.response.body.items.item;
  const weatherResult = weatherFilter(weatherInfo);

  res.json({
    result: "success",
    weatherResult,
  });
});
