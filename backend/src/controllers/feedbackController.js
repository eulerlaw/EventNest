const Feedback = require('../models/Feedback');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const sentimentAnalyzer = require('../services/sentimentAnalyzer');
const { sendNotification } = require('../services/notificationService');

// @desc    Submit event feedback with real-time sentiment analysis
// @route   POST /api/feedback/:eventId
// @access  Private (Student)
exports.submitFeedback = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { rating, commentText } = req.body;
    const userId = req.user._id;

    if (!rating || !commentText) {
      return res.status(400).json({
        success: false,
        message: 'Both a numeric rating (1-5) and feedback comment are required'
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Verify registration and attendance
    const registration = await Registration.findOne({ user: userId, event: eventId });
    if (!registration) {
      return res.status(403).json({
        success: false,
        message: 'Only registered participants are eligible to submit feedback'
      });
    }

    // Check duplicate feedback
    const existingFeedback = await Feedback.findOne({ user: userId, event: eventId });
    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted feedback for this event'
      });
    }

    // Run AI Sentiment Analysis Engine
    const sentimentResult = sentimentAnalyzer.analyzeSentiment(commentText);

    const feedback = await Feedback.create({
      event: eventId,
      user: userId,
      rating: Number(rating),
      commentText: commentText.trim(),
      sentiment: {
        score: sentimentResult.score,
        label: sentimentResult.label,
        keywords: sentimentResult.keywords
      }
    });

    // Update Event aggregate rating and count
    const allEventFeedbacks = await Feedback.find({ event: eventId });
    const avgRating = allEventFeedbacks.reduce((acc, item) => acc + item.rating, 0) / allEventFeedbacks.length;

    event.feedbackCount = allEventFeedbacks.length;
    event.averageRating = parseFloat(avgRating.toFixed(2));
    await event.save();

    // Notify event organizer
    await sendNotification({
      recipientId: event.organizer,
      title: 'New Event Feedback Received 📝',
      message: `A participant submitted ${sentimentResult.label} feedback (${rating}⭐) for "${event.title}".`,
      type: 'feedback',
      link: `/organizer/events/${eventId}/analytics`
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted and analyzed successfully',
      feedback: {
        ...feedback.toObject(),
        detectedThemes: sentimentResult.themes
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all feedback and aggregated sentiment analytics for an event
// @route   GET /api/feedback/event/:eventId
// @access  Private (Organizer, Admin)
exports.getEventFeedback = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view event feedback reports' });
    }

    const feedbacks = await Feedback.find({ event: eventId })
      .populate('user', 'name email department rollNumber avatar')
      .sort({ createdAt: -1 });

    const analytics = sentimentAnalyzer.aggregateEventSentiment(feedbacks);

    res.json({
      success: true,
      event: {
        _id: event._id,
        title: event.title,
        category: event.category,
        averageRating: event.averageRating,
        feedbackCount: event.feedbackCount
      },
      analytics,
      feedbacks
    });
  } catch (err) {
    next(err);
  }
};
