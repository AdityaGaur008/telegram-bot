const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: { type: Number, unique: true },
  subscribed: { type: Boolean, default: false },
  blocked: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);
