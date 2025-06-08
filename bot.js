const TelegramBot = require("node-telegram-bot-api");
const mongoose = require('mongoose');
const config = require("./config");
const botController = require("./Controllers/bot.controller.js");
const cron = require("node-cron");
const Settings = require('./Models/Settings');

async function initializeSettings() {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({ openWeatherApiKey: config.OPENWEATHER_API_KEY });
      await settings.save();
      console.log('Settings initialized with API key');
    }
  } catch (error) {
    console.error('Failed to initialize settings:', error);
    process.exit(1);
  }
}

// Connect to MongoDB and initialize bot after settings are ready
mongoose.connect(config.MONGO_URI)
  .then(() => {
    console.log('Bot connected to MongoDB');
    return initializeSettings();
  })
  .then(() => {
    console.log('Bot settings initialized');
    const bot = new TelegramBot(config.BOT_TOKEN, { polling: true });
    
    // Register bot commands
    bot.onText(/\/start/, (msg) => botController.handleStart(bot, msg));
    bot.onText(/\/subscribe/, (msg) => botController.handleSubscribe(bot, msg));
    bot.onText(/\/unsubscribe/, (msg) => botController.handleUnsubscribe(bot, msg));
    bot.onText(/\/weather (.+)/, (msg, match) => botController.handleWeather(bot, msg, match));

    // Schedule daily weather updates
    cron.schedule("0 8 * * *", () => {
      botController.sendDailyWeather(bot);
    });

    console.log("Bot is running with polling...");
  })
  .catch((err) => {
    console.error('Bot startup error:', err);
    process.exit(1);
  });
