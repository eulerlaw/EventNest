const Event = require('../models/Event');
const Registration = require('../models/Registration');
const recommendationEngine = require('../services/recommendationEngine');

// @desc    Get personalized event recommendations for current student
// @route   GET /api/recommendations
// @access  Private (Student)
exports.getRecommendations = async (req, res, next) => {
  try {
    const student = req.user;
    const limit = parseInt(req.query.limit) || 6;

    // 1. Fetch student's past registered events
    const registrations = await Registration.find({ user: student._id })
      .populate('event', 'title category tags description');
    
    const pastEvents = registrations
      .map(r => r.event)
      .filter(Boolean);

    // 2. Fetch all upcoming published events
    const candidateEvents = await Event.find({
      status: 'published',
      dateTime: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Upcoming or today
    }).populate('organizer', 'name organizationName avatar');

    // 3. Run TF-IDF & Cosine Similarity Recommendation Engine
    const recommendations = recommendationEngine.getPersonalizedRecommendations(
      student,
      candidateEvents,
      pastEvents,
      limit
    );

    res.json({
      success: true,
      count: recommendations.length,
      userInterests: student.interests,
      department: student.department,
      recommendations
    });
  } catch (err) {
    next(err);
  }
};
