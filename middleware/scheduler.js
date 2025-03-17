const { fetchDataAndStoreInDB } = require("../routes/fetchStoreData");

function getTimeUntilNext12PM() {
  const now = new Date();
  const next12PM = new Date();

  next12PM.setHours(12, 0, 0, 0);

  if (now > next12PM) {
    next12PM.setDate(next12PM.getDate() + 1);
  }

  return next12PM - now;
}

function scheduleFetchData() {
  const timeUntilNext12PM = getTimeUntilNext12PM();

  setTimeout(() => {
    console.log("Running fetchDataAndStoreInDB at 12 PM...");
    fetchDataAndStoreInDB();

    setInterval(() => {
      console.log("Running fetchDataAndStoreInDB at 12 PM...");
      fetchDataAndStoreInDB();
    }, 24 * 60 * 60 * 1000);
  }, timeUntilNext12PM);
}

module.exports = scheduleFetchData;
