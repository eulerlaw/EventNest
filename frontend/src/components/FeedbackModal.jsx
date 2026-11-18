import React, { useState } from 'react';
import { X, Star, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { feedbackService } from '../services/api';
import SentimentBadge from './SentimentBadge';

const FeedbackModal = ({ isOpen, onClose, event, onFeedbackSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  if (!isOpen || !event) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!commentText.trim()) {
      setError('Please provide written feedback for this event');
      return;
    }

    setSubmitting(true);
    try {
      const res = await feedbackService.submitFeedback(event._id, {
        rating,
        commentText: commentText.trim()
      });

      if (res.data.success) {
        setSuccess(res.data.feedback);
        if (onFeedbackSubmitted) {
          onFeedbackSubmitted(res.data.feedback);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        <div className="p-6 bg-gradient-to-r from-brand-700 to-indigo-600 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-2 text-brand-200 text-xs font-bold uppercase mb-1">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI Feedback Analysis</span>
          </div>
          <h3 className="text-lg font-bold text-white">{event.title}</h3>
          <p className="text-xs text-brand-100 mt-1">Your feedback directly powers organiser analytics</p>
        </div>

        {success ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-800">Feedback Analyzed & Saved!</h4>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-left text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Assigned Sentiment:</span>
                <SentimentBadge label={success.sentiment?.label} score={success.sentiment?.score} showScore />
              </div>
              {success.detectedThemes && success.detectedThemes.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Detected Themes:</span>
                  <span className="font-semibold text-slate-800">{success.detectedThemes.join(', ')}</span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 font-medium">
                {error}
              </div>
            )}

            {/* Star Rating Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Overall Event Rating (1 to 5 Stars)
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-600 ml-2">
                  {rating} / 5
                </span>
              </div>
            </div>

            {/* Written Comments */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Detailed Feedback & Suggestions
              </label>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts on the speaker, presentation, organization, venue, and what could be improved..."
                rows={4}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white resize-none"
              ></textarea>
              <p className="text-[11px] text-slate-400 mt-1">
                Natural Language Processing (VADER) classifies text into Positive, Neutral or Negative.
              </p>
            </div>

            {/* Submit */}
            <div className="flex space-x-2 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-xs transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Analyzing & Saving...' : 'Submit Feedback'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
