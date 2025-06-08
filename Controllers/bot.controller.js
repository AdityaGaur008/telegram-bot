const User = require("../Models/User");
const Settings = require("../Models/Settings");
const { getWeather } = require("../services/weather.service.js");
const config = require("../config");

async function getSettings() {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings({ openWeatherApiKey: config.OPENWEATHER_API_KEY });
    await settings.save();
  }
  return settings;
}

async function handleStart(bot, msg) {
  try {
    const chatId = msg.chat.id;
    console.log("Handling /start for chatId:", chatId);
    let user = await User.findOne({ telegramId: chatId });
    if (!user) {
      user = new User({ telegramId: chatId });
      await user.save();
    }
    if (user.blocked) {
      return bot.sendMessage(chatId, "You are blocked from using this bot.");
    }
    bot.sendMessage(
      chatId,
      "Welcome! Use /subscribe to get daily weather updates and /unsubscribe to stop."
    );
  } catch (error) {
    console.error("Error in handleStart:", error);
    bot.sendMessage(msg.chat.id, "An error occurred. Please try again later.");
  }
}

async function handleSubscribe(bot, msg) {
  const chatId = msg.chat.id;
  let user = await User.findOne({ telegramId: chatId });
  if (!user) {
    user = new User({ telegramId: chatId, subscribed: true });
  } else {
    if (user.blocked) return bot.sendMessage(chatId, "You are blocked.");
    user.subscribed = true;
  }
  await user.save();
  bot.sendMessage(chatId, "You have subscribed to daily weather updates.");
}

async function handleUnsubscribe(bot, msg) {
  const chatId = msg.chat.id;
  let user = await User.findOne({ telegramId: chatId });
  if (user) {
    user.subscribed = false;
    await user.save();
  }
  bot.sendMessage(chatId, "You have unsubscribed from daily weather updates.");
}

async function sendDailyWeather(bot) {
  const settings = await getSettings();
  const users = await User.find({ subscribed: true, blocked: false });
  for (const user of users) {
    const weatherText = await getWeather(
      config.WEATHER_DEFAULT_CITY,
      settings.openWeatherApiKey
    );
    bot.sendMessage(user.telegramId, weatherText);
  }
}
async function handleWeather(bot, msg, match) {
  const telegramId = msg.chat.id;
  const city = match[1];

  try {
    const weather = await getWeather(city); // Use getWeather directly since we imported it
    const response = `🌤 *Weather in ${city}*\nCondition: ${weather.description}\nTemperature: ${weather.temp}°C`;

    bot.sendMessage(telegramId, response, { parse_mode: "Markdown" });
  } catch (err) {
    console.error(err);
    bot.sendMessage(
      telegramId,
      "Could not fetch weather data. Please check the city name."
    );
  }
}

module.exports = {
  handleStart,
  handleSubscribe,
  handleUnsubscribe,
  sendDailyWeather,
  getSettings,
  handleWeather,
};
