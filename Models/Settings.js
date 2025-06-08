const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  openWeatherApiKey: { type: String, required: true }
});

module.exports = mongoose.model('Settings', settingsSchema);
