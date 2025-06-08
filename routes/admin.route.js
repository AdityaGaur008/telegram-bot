const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/admin.controller.js');
const config = require('../config');

// Basic auth middleware
function checkAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) {
    res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('Authentication required.');
  }
  const b64auth = auth.split(' ')[1];
  const [user, pass] = Buffer.from(b64auth, 'base64').toString().split(':');
  if (user === config.ADMIN_USERNAME && pass === config.ADMIN_PASSWORD) {
    return next();
  }
  res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
  res.status(401).send('Authentication required.');
}

// Apply the middleware globally to all routes
router.use(checkAuth);

// Define routes
 
router.get('/users',checkAuth, adminController.getUsers);
router.post('/users/block', adminController.blockUser);
router.post('/users/delete', adminController.deleteUser);
router.get('/settings', adminController.getSettings);
router.post('/settings', adminController.updateSettings);

module.exports = router;
