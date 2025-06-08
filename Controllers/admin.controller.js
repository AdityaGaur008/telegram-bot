const User = require("../Models/User");
const Settings = require("../Models/Settings");
 

async function getUsers(req, res) {
  try {
    const users = await User.find();
    // Choose one of the following:

    // Option 1: Render the view
    res.render("Users", { users });

    // Option 2: Send JSON response
    // res.json(users);
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
}

async function blockUser(req, res) {
  try {
    console.log(req.body); // Log the request body to verify the userId
    const { userId } = req.body; // Extract userId from the request body
    const user = await User.findById(userId); // Find the user by ID
    if (user) {
      user.blocked = true;
      user.subscribed = false;
      await user.save();
      return res.json({ success: true, message: "User blocked successfully" });
    }
    res.status(404).json({ success: false, message: "User not found" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ success: false, message: "Failed to block user" });
  }
}

async function deleteUser(req, res) {
  try {
    console.log(req.body); // Log the request body to verify the userId
    const { userId } = req.body; // Extract userId from the request body
    const result = await User.findByIdAndDelete(userId); // Delete the user by ID
    if (result) {
      return res.json({ success: true, message: "User deleted successfully" });
    }
    res.status(404).json({ success: false, message: "User not found" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
}

async function getSettings(req, res) {
  try {
    const settings = await Settings.findOne();
    const openWeatherApiKey = settings ? settings.openWeatherApiKey : "";
    res.render("Settings", { openWeatherApiKey }); // Render the settings.ejs template
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).send("Failed to load settings");
  }
}

async function updateSettings(req, res) {
  const { openWeatherApiKey } = req.body;
  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings();
  }
  settings.openWeatherApiKey = openWeatherApiKey;
  await settings.save();
  res.json({ success: true, message: "API key updated" });
}

module.exports = {

  getUsers,
  blockUser,
  deleteUser,
  getSettings,
  updateSettings,
};
