require('dotenv').config();
console.log('BOT_TOKEN:', process.env.BOT_TOKEN ? 'Loaded' : 'Missing');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Loaded' : 'Missing');
console.log('OPENWEATHER_API_KEY:', process.env.OPENWEATHER_API_KEY ? 'Loaded' : 'Missing');

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  MONGO_URI: process.env.MONGO_URI,
  OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  ADMIN_USERNAME: 'admin', // hardcoded for simplicity
  WEATHER_DEFAULT_CITY: 'Delhi', // default city for demo
};
