const axios = require("axios");

const getGoldPrice = async () => {
  try {
    const url = `https://api.gold-api.com/price/XAU`;

    const response = await axios.get(url);
    const goldPricePerOunce = response.data.price; 
    const goldPricePerGram = goldPricePerOunce / 31.1035;

    return goldPricePerGram;
  } catch (err) {
    console.error("Altın fiyatı alınamadı:", err.message);
    return null;
  }
};

module.exports = { getGoldPrice };
