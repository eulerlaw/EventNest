const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Event category is required'],
      enum: ['Technical', 'Hackathon', 'Workshop', 'Cultural', 'Sports', 'Seminar', 'Conference'],
      default: 'Technical'
    },
    tags: {
      type: [String],
      default: []
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80'
    },
    dateTime: {
      type: Date,
      required: [true, 'Event date and time is required']
    },
    endDateTime: {
      type: Date
    },
    venue: {
      type: String,
      required: [true, 'Event venue is required'],
      trim: true
    },
    capacity: {
      type: Number,
      required: [true, 'Registration capacity is required'],
      min: [1, 'Capacity must be at least 1']
    },
    registeredCount: {
      type: Number,
      default: 0
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Registration deadline is required']
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'completed', 'cancelled'],
      default: 'published'
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved'
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    averageRating: {
      type: Number,
      default: 0
    },
    feedbackCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Indexes for fast searching and filtering
eventSchema.index({ title: 'text', description: 'text', tags: 'text' });
eventSchema.index({ category: 1, dateTime: 1, status: 1 });

module.exports = mongoose.model('Event', eventSchema);
