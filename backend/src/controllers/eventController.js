const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Feedback = require('../models/Feedback');

// @desc    Get all events with filters (Search, Category, Status, Sort)
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res, next) => {
  try {
    const { search, category, status, sort, page = 1, limit = 20, upcoming } = req.query;
    const query = {};

    // Filter by approval & publication unless requested by authorized roles
    if (status) {
      query.status = status;
    } else {
      query.status = { $in: ['published', 'completed'] };
    }
    query.approvalStatus = 'approved';

    // Search keyword in title, description, or tags
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { venue: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter upcoming only
    if (upcoming === 'true') {
      query.dateTime = { $gte: new Date() };
    }

    // Sorting
    let sortBy = { dateTime: 1 };
    if (sort === 'popular') {
      sortBy = { registeredCount: -1 };
    } else if (sort === 'rating') {
      sortBy = { averageRating: -1 };
    } else if (sort === 'newest') {
      sortBy = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Event.countDocuments(query);
    const events = await Event.find(query)
      .populate('organizer', 'name email organizationName avatar')
      .sort(sortBy)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: events.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      events
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single event by ID with registration & feedback status
// @route   GET /api/events/:id
// @access  Public
exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email organizationName avatar');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    let userRegistration = null;
    let userFeedback = null;

    if (req.user) {
      userRegistration = await Registration.findOne({
        user: req.user._id,
        event: event._id
      });

      userFeedback = await Feedback.findOne({
        user: req.user._id,
        event: event._id
      });
    }

    res.json({
      success: true,
      event,
      userRegistration,
      userFeedback
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Organizer, Admin)
exports.createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      tags,
      coverImage,
      dateTime,
      endDateTime,
      venue,
      capacity,
      registrationDeadline,
      status
    } = req.body;

    const event = await Event.create({
      title,
      description,
      category,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      coverImage: coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
      dateTime,
      endDateTime: endDateTime || null,
      venue,
      capacity: Number(capacity),
      registrationDeadline: registrationDeadline || dateTime,
      organizer: req.user._id,
      status: status || 'published',
      approvalStatus: req.user.role === 'admin' ? 'approved' : 'approved' // Auto-approved for smooth demonstration
    });

    res.status(201).json({
      success: true,
      event
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private (Organizer owner, Admin)
exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Authorization check
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this event'
      });
    }

    if (req.body.tags && typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',').map(t => t.trim());
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('organizer', 'name email organizationName avatar');

    res.json({
      success: true,
      event
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Organizer owner, Admin)
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }

    // Clean up registrations & feedbacks
    await Registration.deleteMany({ event: event._id });
    await Feedback.deleteMany({ event: event._id });
    await event.deleteOne();

    res.json({
      success: true,
      message: 'Event and associated registrations successfully deleted'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get events organized by current user
// @route   GET /api/events/organizer/my-events
// @access  Private (Organizer)
exports.getMyOrganizedEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ organizer: req.user._id })
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
