const express = require('express');
const router = express.Router();
const { askChatbot } = require('../controllers/chatbotController');

// Optional auth so chatbot knows student's profile if logged in
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    const jwt = require('jsonwebtoken');
    const config = require('../config/config');
    const User = require('../models/User');
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, config.JWT_SECRET);
      User.findById(decoded.id).select('-password').then(user => {
        req.user = user;
        next();
      }).catch(() => next());
    } catch {
      next();
    }
  } else {
    next();
  }
};

router.post('/query', optionalAuth, askChatbot);

module.exports = router;
