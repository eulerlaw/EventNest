import React, { useState, useEffect } from 'react';
import { registrationService } from '../../services/api';
import QRPassModal from '../../components/QRPassModal';
import FeedbackModal from '../../components/FeedbackModal';
import {
  Ticket,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Download,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'attended', 'cancelled'
  const [selectedPass, setSelectedPass] = useState(null);
  const [feedbackEvent, setFeedbackEvent] = useState(null);

  const fetchRegistrations = async () => {
    try {
      const res = await registrationService.getMyRegistrations();
      if (res.data.success) {
        setRegistrations(res.data.registrations);
      }
    } catch (err) {
      console.error('Failed to fetch registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleCancelRegistration = async (id, eventTitle) => {
    if (!window.confirm(`Are you sure you want to cancel your pass for "${eventTitle}"?`)) {
      return;
    }

    try {
      const res = await registrationService.cancelRegistration(id);
      if (res.data.success) {
        setRegistrations((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: 'cancelled' } : r))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel registration');
    }
  };

  const filtered = registrations.filter((r) => {
    if (activeTab === 'active') return r.status === 'registered';
    if (activeTab === 'attended') return r.status === 'attended';
    if (activeTab === 'cancelled') return r.status === 'cancelled';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Digital Passes
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access your verifiable QR entry codes, track attendance, and provide event reviews
          </p>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl w-fit">
          {['all', 'active', 'attended', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Passes List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-slate-100 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
          <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Registrations in this View</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don't have any passes matching the selected filter.
          </p>
          <Link
            to="/explore"
            className="inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700"
          >
            Browse Campus Events
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((reg) => {
            const event = reg.event || {};
            const isAttended = reg.status === 'attended';
            const isCancelled = reg.status === 'cancelled';

            return (
              <div
                key={reg._id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Left: Event Info & Ticket Badge */}
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 hidden sm:block">
                    <img
                      src={event.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&q=80'}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-brand-50 text-brand-700">
                        {event.category}
                      </span>
                      {isAttended ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Attended</span>
                        </span>
                      ) : isCancelled ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 flex items-center space-x-1">
                          <XCircle className="w-3 h-3" />
                          <span>Cancelled</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>Active Pass</span>
                        </span>
                      )}
                    </div>

                    <Link to={`/events/${event._id}`}>
                      <h3 className="text-base font-bold text-slate-900 hover:text-brand-600 transition-colors">
                        {event.title}
                      </h3>
                    </Link>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-0.5">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(event.dateTime).toLocaleDateString()}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{event.venue}</span>
                      </span>
                      <span className="font-mono text-slate-400 text-[11px]">
                        Ticket #{reg.ticketId}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center space-x-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                  {!isCancelled && (
                    <button
                      onClick={() => setSelectedPass(reg)}
                      className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-colors"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>View Pass</span>
                    </button>
                  )}

                  {isAttended && (
                    <button
                      onClick={() => setFeedbackEvent(event)}
                      className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs flex items-center space-x-1.5 border border-amber-200 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Rate & Review</span>
                    </button>
                  )}

                  {!isAttended && !isCancelled && (
                    <button
                      onClick={() => handleCancelRegistration(reg._id, event.title)}
                      className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QR Pass Modal */}
      {selectedPass && (
        <QRPassModal
          isOpen={!!selectedPass}
          onClose={() => setSelectedPass(null)}
          registration={selectedPass}
        />
      )}

      {/* Feedback Modal */}
      {feedbackEvent && (
        <FeedbackModal
          isOpen={!!feedbackEvent}
          onClose={() => setFeedbackEvent(null)}
          event={feedbackEvent}
        />
      )}
    </div>
  );
};

export default MyRegistrations;
