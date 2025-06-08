const axios = require("axios");
const Setting = require("../Models/Settings.js");
const config = require("../config");

async function getWeather(city = "Delhi") {
  try {
    const settings = await Setting.findOne();
    if (!settings || !settings.openWeatherApiKey) {
      throw new Error("OpenWeather API key not found");
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${settings.openWeatherApiKey}&units=metric`;
    
    const response = await axios.get(url);
    return {
      description: response.data.weather[0].description,
      temp: response.data.main.temp
    };
  } catch (error) {
    console.error("Weather API Error:", error.message);
    throw error;
  }
}

module.exports = { getWeather };
