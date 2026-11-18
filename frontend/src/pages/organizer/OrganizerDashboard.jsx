import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../../services/api';
import StatCard from '../../components/StatCard';
import {
  Calendar,
  Users,
  CheckCircle2,
  Star,
  PlusCircle,
  QrCode,
  BarChart3,
  ExternalLink,
  Edit,
  Trash2
} from 'lucide-react';

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyEvents = async () => {
    try {
      const res = await eventService.getMyOrganizedEvents();
      if (res.data.success) {
        setEvents(res.data.events);
      }
    } catch (err) {
      console.error('Failed to load organizer events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const totalRegistrations = events.reduce((sum, e) => sum + (e.registeredCount || 0), 0);
  const totalFeedbackCount = events.reduce((sum, e) => sum + (e.feedbackCount || 0), 0);
  const ratedEvents = events.filter((e) => e.averageRating > 0);
  const overallAvgRating =
    ratedEvents.length > 0
      ? (ratedEvents.reduce((sum, e) => sum + e.averageRating, 0) / ratedEvents.length).toFixed(1)
      : '0.0';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header & Host Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Organizer Management Studio
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Host campus events, verify attendance via QR, and analyze real-time sentiment feedback
          </p>
        </div>

        <Link
          to="/organizer/events/new"
          className="px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-brand-500/25 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Host New Event</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Events Hosted" value={events.length} icon={Calendar} color="brand" />
        <StatCard title="Total Registrations" value={totalRegistrations} icon={Users} color="indigo" />
        <StatCard title="Average Rating" value={`${overallAvgRating} ⭐`} icon={Star} color="amber" />
        <StatCard title="Feedbacks Collected" value={totalFeedbackCount} icon={CheckCircle2} color="emerald" />
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900">Your Campus Events</h3>
          <span className="text-xs font-semibold text-slate-500">{events.length} total</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">No events published yet</h4>
            <p className="text-xs text-slate-500">Click "Host New Event" to launch your first event</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Event</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Date & Venue</th>
                  <th className="py-3.5 px-4">Registrations</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((ev) => (
                  <tr key={ev._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <img
                          src={ev.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&q=80'}
                          alt={ev.title}
                          className="w-10 h-10 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <Link
                            to={`/events/${ev._id}`}
                            className="font-bold text-slate-900 hover:text-brand-600 line-clamp-1"
                          >
                            {ev.title}
                          </Link>
                          <span className={`inline-block text-[10px] font-bold uppercase ${
                            ev.status === 'completed' ? 'text-slate-400' : 'text-emerald-600'
                          }`}>
                            {ev.status}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-700">
                      {ev.category}
                    </td>

                    <td className="py-4 px-4 text-slate-500">
                      <p className="font-semibold text-slate-800">
                        {new Date(ev.dateTime).toLocaleDateString()}
                      </p>
                      <p className="text-[11px] truncate max-w-[150px]">{ev.venue}</p>
                    </td>

                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-800">
                          {ev.registeredCount || 0} / {ev.capacity}
                        </span>
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-500 rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round(((ev.registeredCount || 0) / ev.capacity) * 100)
                              )}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      {ev.averageRating > 0 ? (
                        <span className="flex items-center space-x-1 font-bold text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{ev.averageRating} ({ev.feedbackCount})</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">No ratings</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <Link
                        to={`/organizer/events/${ev._id}/attendees`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold transition-colors"
                        title="View attendees & scan QR codes"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Attendees & QR</span>
                      </Link>

                      <Link
                        to={`/organizer/events/${ev._id}/analytics`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold border border-amber-200 transition-colors"
                        title="View VADER feedback sentiment reports"
                      >
                        <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
                        <span>Sentiment Analytics</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
