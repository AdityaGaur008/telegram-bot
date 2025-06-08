const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const adminRoutes = require('./routes/admin.route.js');
const config = require('./config');
const path = require('path');

// Load the Telegram bot
require('./bot'); // <== This will start your Telegram bot

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/admin', adminRoutes);

// Connect DB
mongoose.connect(config.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Admin panel listening on port ${PORT}`);
});
