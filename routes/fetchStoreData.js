const mongoose = require("mongoose");
const axios = require("axios");

const MandiPrice = require("../models/mandiPrices");

const isValidNumber = (value) => {
  return !isNaN(value) && value !== "NA";
};

const fetchDataAndStoreInDB = async () => {
  try {
    const response = await axios.get(
      "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001f665d8c53ebc4d9f7c6cbee1f85aa583&format=json&limit=10000"
    );
    console.log("Data fetched successfully from API");

    const records = response.data.records;

    // Iterate through each record
    for (const record of records) {
      // Validate the record
      if (
        !record.state ||
        !record.district ||
        !record.market ||
        !record.commodity ||
        !record.variety ||
        !record.grade ||
        !record.arrival_date ||
        !isValidNumber(record.min_price) ||
        !isValidNumber(record.max_price)
      ) {
        console.log("Skipping invalid record:", record);
        continue;
      }

      const mandiPrice = new MandiPrice({
        state: record.state,
        district: record.district,
        market: record.market,
        commodity: record.commodity,
        variety: record.variety,
        grade: record.grade,
        arrival_date: record.arrival_date,
        min_price: record.min_price,
        max_price: record.max_price,
        modal_price: record.modal_price,
      });

      try {
        await mandiPrice.save();
        console.log("Record saved successfully:", record);
      } catch (saveError) {
        console.error("Error saving record:", saveError);
      }
    }

    console.log("All valid data processed and stored successfully!");
  } catch (error) {
    console.error("Error fetching or storing data:", error);
  }
};

module.exports = {
  fetchDataAndStoreInDB,
};
