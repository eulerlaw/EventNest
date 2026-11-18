const express = require('express');
const router = express.Router();
const {
  getPlatformStats,
  getAllUsers,
  toggleUserStatus,
  getAllEventsAdmin,
  updateEventApproval
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes require Admin authorization
router.use(protect, authorize('admin'));

router.get('/stats', getPlatformStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', toggleUserStatus);
router.get('/events', getAllEventsAdmin);
router.put('/events/:id/approval', updateEventApproval);

module.exports = router;
