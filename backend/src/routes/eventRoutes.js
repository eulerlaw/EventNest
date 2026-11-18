const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyOrganizedEvents
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

// Optional auth helper to check if user token is present for event details
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return protect(req, res, next);
  }
  next();
};

router.get('/', getEvents);
router.get('/organizer/my-events', protect, authorize('organizer', 'admin'), getMyOrganizedEvents);
router.get('/:id', optionalAuth, getEventById);
router.post('/', protect, authorize('organizer', 'admin'), createEvent);
router.put('/:id', protect, authorize('organizer', 'admin'), updateEvent);
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteEvent);

module.exports = router;
