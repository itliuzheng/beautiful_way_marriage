const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function addDate(dateStr, diffDay) {
  var dateTime = (new Date(dateStr)).getTime();
  var diffTimeLong = dateTime + (diffDay) * 24 * 3600 * 1000;
  var diffTime = new Date(diffTimeLong);
  var m = (diffTime.getMonth() + 1) < 10 ? "0" + (diffTime.getMonth() + 1) : (diffTime.getMonth() + 1);
  var d = diffTime.getDate() < 10 ? "0" + diffTime.getDate() : diffTime.getDate();
  return diffTime.getFullYear() + "-" + m + "-" + d;
}

module.exports = {
  formatTime: formatTime,
  addDate: addDate
}
