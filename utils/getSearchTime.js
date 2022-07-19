const getSearchTime = () => {
  const options = {
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  const updateTime = ["0200", "0500", "0800", "1100", "1400", "1700", "2000", "2300"];

  const currentDate = new Date().toLocaleString("ko-KR", options);
  const splitDate = currentDate.split(" ");

  const time = `${splitDate[splitDate.length - 1].split(":")[0]}00`;
  const date = splitDate.reduce((acc, cur, idx, arr) => {
    if (idx === 2) {
      arr.splice(1);
    }

    return acc + cur;
  }).split(".").join("");

  const baseTime = updateTime.filter((item) => item < time);

  return { baseTime: baseTime[baseTime.length - 1], date };
};

module.exports = getSearchTime;
