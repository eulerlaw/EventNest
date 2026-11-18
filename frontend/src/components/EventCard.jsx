import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Star, Sparkles, ArrowRight } from 'lucide-react';

const EventCard = ({ event, similarityScore = null, matchReasons = [], onRegister = null, isRegistered = false }) => {
  const seatsLeft = Math.max(0, event.capacity - (event.registeredCount || 0));
  const percentFull = Math.min(100, Math.round(((event.registeredCount || 0) / event.capacity) * 100));

  const categoryColors = {
    Technical: 'bg-blue-100 text-blue-800 border-blue-200',
    Hackathon: 'bg-purple-100 text-purple-800 border-purple-200',
    Workshop: 'bg-amber-100 text-amber-800 border-amber-200',
    Cultural: 'bg-pink-100 text-pink-800 border-pink-200',
    Sports: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Seminar: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    Conference: 'bg-cyan-100 text-cyan-800 border-cyan-200'
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-brand-300 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Cover Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={event.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border shadow-xs ${categoryColors[event.category] || 'bg-slate-100 text-slate-800 border-slate-200'}`}>
            {event.category}
          </span>
        </div>

        {/* Similarity Score Pill if provided (AI Recommendation) */}
        {similarityScore !== null && (
          <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{Math.round(similarityScore * 100)}% Match</span>
          </div>
        )}

        {/* Date on Image */}
        <div className="absolute bottom-3 left-3 text-white">
          <p className="text-xs font-medium text-slate-200 flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-brand-400" />
            <span>{new Date(event.dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </p>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="flex items-center space-x-1 truncate max-w-[70%]">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </span>
            {event.averageRating > 0 && (
              <span className="flex items-center space-x-1 text-amber-600 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{event.averageRating}</span>
              </span>
            )}
          </div>

          <Link to={`/events/${event._id}`}>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1 mb-2">
              {event.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
            {event.description}
          </p>

          {/* AI Match Reasons tags */}
          {matchReasons && matchReasons.length > 0 && (
            <div className="mb-3 flex items-center flex-wrap gap-1">
              <span className="text-[10px] text-slate-400 font-medium">Matched:</span>
              {matchReasons.slice(0, 3).map((r, i) => (
                <span key={i} className="text-[10px] bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded font-medium">
                  #{r}
                </span>
              ))}
            </div>
          )}

          {/* Capacity Progress Bar */}
          <div className="space-y-1 mb-4">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center space-x-1">
                <Users className="w-3 h-3 text-slate-400" />
                <span>{event.registeredCount || 0} / {event.capacity} registered</span>
              </span>
              <span className={seatsLeft <= 5 ? 'font-bold text-rose-600' : 'font-medium'}>
                {seatsLeft === 0 ? 'Full' : `${seatsLeft} seats left`}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  percentFull >= 90 ? 'bg-rose-500' : percentFull >= 70 ? 'bg-amber-500' : 'bg-brand-500'
                }`}
                style={{ width: `${percentFull}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <Link
            to={`/events/${event._id}`}
            className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center space-x-1"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {isRegistered ? (
            <span className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-100 text-emerald-800">
              Registered ✓
            </span>
          ) : seatsLeft === 0 ? (
            <span className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 text-slate-500">
              Closed
            </span>
          ) : onRegister ? (
            <button
              onClick={() => onRegister(event._id)}
              className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition-colors"
            >
              Register
            </button>
          ) : (
            <Link
              to={`/events/${event._id}`}
              className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition-colors"
            >
              Register
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
