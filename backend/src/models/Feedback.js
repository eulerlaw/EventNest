const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required (1-5)'],
      min: 1,
      max: 5
    },
    commentText: {
      type: String,
      required: [true, 'Feedback text is required'],
      trim: true
    },
    sentiment: {
      score: {
        type: Number,
        default: 0
      },
      label: {
        type: String,
        enum: ['positive', 'negative', 'neutral'],
        default: 'neutral'
      },
      keywords: {
        type: [String],
        default: []
      }
    }
  },
  {
    timestamps: true
  }
);

feedbackSchema.index({ event: 1, user: 1 }, { unique: true });
feedbackSchema.index({ event: 1, 'sentiment.label': 1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
