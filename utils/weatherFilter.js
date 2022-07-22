const weatherFilter = (weatherInfo) => {
  const filterCategory = weatherInfo.filter((item) => (item.category === "TMP" || item.category === "SKY" || item.category === "PTY" || item.category === "PCP"));

  const result = {};
  const options = {
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  const currentDate = new Date().toLocaleString("ko-KR", options);
  const splitDate = currentDate.split(" ");

  const startTime = `${Number(splitDate[splitDate.length - 1].split(":")[0]) - 1}00`;
  const endTime = `${Number(splitDate[splitDate.length - 1].split(":")[0]) + 1}00`;
  const time = `${splitDate[splitDate.length - 1].split(":")[0]}00`;

  for (let i = 0; i < filterCategory.length; i++) {
    const key = `${filterCategory[i].fcstTime}:${filterCategory[i].category}`;
    const condition = filterCategory[i].fcstTime === startTime || filterCategory[i].fcstTime === time || filterCategory[i].fcstTime === endTime;

    if (condition) {
      result[key] = filterCategory[i].fcstValue;
    }
  }

  return result;
};

module.exports = weatherFilter;
