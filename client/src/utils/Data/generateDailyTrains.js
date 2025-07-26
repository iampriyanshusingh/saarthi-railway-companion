import formattime from "../Data/formatTime";

const generateDailyTrains = (
  baseId,
  name,
  numberPrefix,
  type,
  route,
  startHour,
  endHour,
  intervalMinutes,
  currentLocation,
  lateBy
) => {
  const trains = [];
  let currentMinute = 0;
  for (let hour = startHour; hour <= endHour; hour++) {
    while (currentMinute < 60) {
      const scheduledTime = formattime(hour, currentMinute);
      trains.push({
        id: `${baseId}-${numberPrefix}-${hour}${currentMinute}`,
        name: `${name} ${type}`,
        number: `${numberPrefix}${Math.floor(Math.random() * 900) + 100}`, // Random 3-digit number
        status: lateBy === "0 min" ? "On Time" : `Delayed by ${lateBy}`,
        scheduledTime: scheduledTime,
        actualTime: lateBy === "0 min" ? scheduledTime : "Delayed", // Simplified actual time
        type: "arriving", // For simplicity, assume all generated are 'arriving'
        currentLocation: currentLocation,
        lateBy: lateBy,
        trainType: type, // 'Fast', 'Slow', 'AC'
        route: route,
      });
      currentMinute += intervalMinutes;
    }
    currentMinute -= 60; // Reset for next hour
  }
  return trains;
};

export default generateDailyTrains;
