const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Feedback = require('../models/Feedback');

// @desc    Get aggregate platform analytics
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getPlatformStats = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalOrganizers = await User.countDocuments({ role: 'organizer' });
    const totalEvents = await Event.countDocuments();
    const publishedEvents = await Event.countDocuments({ status: 'published' });
    const totalRegistrations = await Registration.countDocuments({ status: { $in: ['registered', 'attended'] } });
    const totalAttended = await Registration.countDocuments({ status: 'attended' });
    const totalFeedbacks = await Feedback.countDocuments();

    // Category breakdown
    const categoryStats = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, registrations: { $sum: '$registeredCount' } } },
      { $project: { category: '$_id', count: 1, registrations: 1, _id: 0 } }
    ]);

    // Sentiment breakdown
    const sentimentStats = await Feedback.aggregate([
      { $group: { _id: '$sentiment.label', count: { $sum: 1 } } }
    ]);

    let positiveCount = 0, neutralCount = 0, negativeCount = 0;
    sentimentStats.forEach(s => {
      if (s._id === 'positive') positiveCount = s.count;
      if (s._id === 'neutral') neutralCount = s.count;
      if (s._id === 'negative') negativeCount = s.count;
    });

    const totalSentiments = positiveCount + neutralCount + negativeCount;
    const sentimentPercentages = {
      positive: totalSentiments > 0 ? Math.round((positiveCount / totalSentiments) * 100) : 0,
      neutral: totalSentiments > 0 ? Math.round((neutralCount / totalSentiments) * 100) : 0,
      negative: totalSentiments > 0 ? Math.round((negativeCount / totalSentiments) * 100) : 0
    };

    // Recent registrations
    const recentRegistrations = await Registration.find()
      .populate('user', 'name email department')
      .populate('event', 'title category')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalOrganizers,
        totalEvents,
        publishedEvents,
        totalRegistrations,
        totalAttended,
        overallAttendanceRate: totalRegistrations > 0 ? Math.round((totalAttended / totalRegistrations) * 100) : 0,
        totalFeedbacks
      },
      categoryStats,
      sentimentStats: {
        counts: { positive: positiveCount, neutral: neutralCount, negative: negativeCount },
        percentages: sentimentPercentages
      },
      recentRegistrations
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users with filtering
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: users.length,
      total,
      users
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Do not allow deactivating self
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot deactivate your own admin account' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User status changed to ${user.isActive ? 'Active' : 'Inactive'}`,
      user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all events for moderation
// @route   GET /api/admin/events
// @access  Private (Admin)
exports.getAllEventsAdmin = async (req, res, next) => {
  try {
    const events = await Event.find()
      .populate('organizer', 'name email organizationName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: events.length,
      events
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update event approval status
// @route   PUT /api/admin/events/:id/approval
// @access  Private (Admin)
exports.updateEventApproval = async (req, res, next) => {
  try {
    const { approvalStatus } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    event.approvalStatus = approvalStatus;
    if (approvalStatus === 'approved') {
      event.status = 'published';
    }
    await event.save();

    res.json({
      success: true,
      message: `Event approval status updated to ${approvalStatus}`,
      event
    });
  } catch (err) {
    next(err);
  }
};
