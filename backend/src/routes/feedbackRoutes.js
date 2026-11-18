const express = require('express');
const router = express.Router();
const {
  submitFeedback,
  getEventFeedback
} = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/auth');

router.post('/:eventId', protect, authorize('student'), submitFeedback);
router.get('/event/:eventId', protect, authorize('organizer', 'admin'), getEventFeedback);

module.exports = router;
