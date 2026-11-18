import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventService, registrationService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import QRPassModal from '../components/QRPassModal';
import FeedbackModal from '../components/FeedbackModal';
import SentimentBadge from '../components/SentimentBadge';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  Star,
  Sparkles,
  ArrowLeft,
  Ticket,
  MessageSquare
} from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const { isAuthenticated, isStudent, user } = useAuth();

  const [event, setEvent] = useState(null);
  const [userRegistration, setUserRegistration] = useState(null);
  const [userFeedback, setUserFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const res = await eventService.getEventById(id);
        if (res.data.success) {
          setEvent(res.data.event);
          setUserRegistration(res.data.userRegistration);
          setUserFeedback(res.data.userFeedback);
        }
      } catch (err) {
        console.error('Error fetching event details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [id]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    setActionLoading(true);
    try {
      const res = await registrationService.register(id);
      if (res.data.success) {
        setUserRegistration(res.data.registration);
        setEvent((prev) => ({
          ...prev,
          registeredCount: (prev.registeredCount || 0) + 1
        }));
        setShowQRModal(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-slate-500">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Event Not Found</h2>
        <p className="text-xs text-slate-500">The requested event could not be retrieved.</p>
        <Link to="/explore" className="inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold">
          Back to Events
        </Link>
      </div>
    );
  }

  const seatsLeft = Math.max(0, event.capacity - (event.registeredCount || 0));
  const isPast = new Date() > new Date(event.dateTime);
  const isRegistered = userRegistration && userRegistration.status !== 'cancelled';
  const isAttended = userRegistration && userRegistration.status === 'attended';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link to="/explore" className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all events</span>
        </Link>
      </div>

      {/* Main Cover Banner */}
      <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden shadow-lg bg-slate-900">
        <img
          src={event.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80'}
          alt={event.title}
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>

        <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-brand-600/90 backdrop-blur-md text-white border border-brand-400/30">
              {event.category}
            </span>
            <span className={`px-3 py-1 rounded-xl text-xs font-bold backdrop-blur-md ${
              event.status === 'completed'
                ? 'bg-slate-800 text-slate-300'
                : 'bg-emerald-600/90 text-white'
            }`}>
              {event.status.toUpperCase()}
            </span>
            {event.averageRating > 0 && (
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-500/90 backdrop-blur-md text-white flex items-center space-x-1">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{event.averageRating} ({event.feedbackCount} reviews)</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {event.title}
          </h1>
        </div>
      </div>

      {/* Grid: Details Left, Registration Card Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Description & Tags */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-3">About this Event</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Event Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Organizer Card */}
            <div className="pt-6 border-t border-slate-100 flex items-center space-x-4">
              <img
                src={event.organizer?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(event.organizer?.name || 'Organizer')}`}
                alt={event.organizer?.name}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-brand-500/20"
              />
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Organized By
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  {event.organizer?.organizationName || event.organizer?.name}
                </h4>
                <p className="text-xs text-slate-500">{event.organizer?.email}</p>
              </div>
            </div>
          </div>

          {/* Post-Event Feedback & Sentiment Section */}
          {(event.status === 'completed' || isAttended) && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Attendee Feedback & Sentiment</h3>
                    <p className="text-[11px] text-slate-500">Automated Natural Language Opinion Mining</p>
                  </div>
                </div>

                {isStudent && isAttended && !userFeedback && (
                  <button
                    onClick={() => setShowFeedbackModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors"
                  >
                    Submit Feedback
                  </button>
                )}
              </div>

              {userFeedback ? (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Your Submitted Review:</span>
                    <SentimentBadge label={userFeedback.sentiment?.label} score={userFeedback.sentiment?.score} showScore />
                  </div>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          userFeedback.rating >= star
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-1">({userFeedback.rating}/5)</span>
                  </div>
                  <p className="text-xs text-slate-600 italic">"{userFeedback.commentText}"</p>
                </div>
              ) : isAttended ? (
                <div className="p-4 bg-brand-50/60 rounded-2xl border border-brand-100 flex items-center justify-between">
                  <p className="text-xs text-brand-900 font-medium">
                    You attended this event! Help the organizers by rating your experience.
                  </p>
                  <button
                    onClick={() => setShowFeedbackModal(true)}
                    className="px-3 py-1.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700"
                  >
                    Rate Now
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Right Column: Time, Venue, Registration Box */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Event Logistics
            </h3>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="flex items-start space-x-3">
                <Calendar className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-900">Date</span>
                  <span>{new Date(event.dateTime).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-900">Time</span>
                  <span>{new Date(event.dateTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-900">Venue</span>
                  <span>{event.venue}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Users className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <div className="w-full">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">Capacity</span>
                    <span>{event.registeredCount || 0} / {event.capacity}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full"
                      style={{ width: `${Math.min(100, Math.round(((event.registeredCount || 0) / event.capacity) * 100))}%` }}
                    ></div>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {seatsLeft > 0 ? `${seatsLeft} seats remaining` : 'Full capacity reached'}
                  </span>
                </div>
              </div>
            </div>

            {/* Registration Action */}
            <div className="pt-4 border-t border-slate-100">
              {isRegistered ? (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                    <p className="text-xs font-bold text-emerald-800">You are registered!</p>
                    <p className="text-[11px] text-emerald-600 mt-0.5">Ticket #{userRegistration.ticketId}</p>
                  </div>
                  <button
                    onClick={() => setShowQRModal(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-colors shadow-xs"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>View Digital QR Pass</span>
                  </button>
                </div>
              ) : isPast ? (
                <button disabled className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs cursor-not-allowed">
                  Event Concluded
                </button>
              ) : seatsLeft === 0 ? (
                <button disabled className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs cursor-not-allowed">
                  Registration Full
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={actionLoading}
                  className="w-full py-3 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all disabled:opacity-50"
                >
                  {actionLoading ? 'Securing Pass...' : 'Register for Event'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* QR Pass Modal */}
      {userRegistration && (
        <QRPassModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          registration={{ ...userRegistration, event }}
        />
      )}

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        event={event}
        onFeedbackSubmitted={(newFb) => {
          setUserFeedback(newFb);
        }}
      />
    </div>
  );
};

export default EventDetails;
