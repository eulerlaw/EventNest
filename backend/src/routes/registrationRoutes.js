const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
  getEventAttendees,
  verifyAttendance
} = require('../controllers/registrationController');
const { protect, authorize } = require('../middleware/auth');

router.post('/:eventId', protect, authorize('student'), registerForEvent);
router.get('/my', protect, authorize('student'), getMyRegistrations);
router.put('/:id/cancel', protect, authorize('student'), cancelRegistration);
router.get('/event/:eventId', protect, authorize('organizer', 'admin'), getEventAttendees);
router.post('/verify-attendance', protect, authorize('organizer', 'admin'), verifyAttendance);

module.exports = router;
