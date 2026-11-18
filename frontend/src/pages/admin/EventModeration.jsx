import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/api';
import { ArrowLeft, Calendar, Check, X, ShieldCheck, MapPin, Users, Star } from 'lucide-react';

const EventModeration = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await adminService.getAdminEvents();
      if (res.data.success) {
        setEvents(res.data.events);
      }
    } catch (err) {
      console.error('Failed to load moderation events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleApproval = async (id, status) => {
    try {
      const res = await adminService.updateEventApproval(id, status);
      if (res.data.success) {
        setEvents((prev) =>
          prev.map((e) => (e._id === id ? { ...e, approvalStatus: status } : e))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update approval status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          to="/admin"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Hub</span>
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Event Moderation</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review campus event submissions, verify guidelines, and approve them for publication
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No events found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Event Title</th>
                  <th className="py-3.5 px-4">Organizer</th>
                  <th className="py-3.5 px-4">Category & Date</th>
                  <th className="py-3.5 px-4">Venue & Capacity</th>
                  <th className="py-3.5 px-4">Approval Status</th>
                  <th className="py-3.5 px-6 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((ev) => (
                  <tr key={ev._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <Link
                        to={`/events/${ev._id}`}
                        className="font-bold text-slate-900 hover:text-brand-600 line-clamp-1"
                      >
                        {ev.title}
                      </Link>
                      <span className="text-[11px] text-slate-400 line-clamp-1">
                        {ev.description}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-800">
                      {ev.organizer?.organizationName || ev.organizer?.name}
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-semibold text-brand-700">{ev.category}</span>
                      <p className="text-[11px] text-slate-400">
                        {new Date(ev.dateTime).toLocaleDateString()}
                      </p>
                    </td>

                    <td className="py-4 px-4 text-slate-600">
                      <p className="truncate max-w-[130px] font-medium">{ev.venue}</p>
                      <p className="text-[11px] text-slate-400">
                        {ev.registeredCount || 0} / {ev.capacity} seats
                      </p>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          ev.approvalStatus === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ev.approvalStatus === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ev.approvalStatus}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right space-x-1.5 whitespace-nowrap">
                      {ev.approvalStatus !== 'approved' && (
                        <button
                          onClick={() => handleApproval(ev._id, 'approved')}
                          className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      {ev.approvalStatus !== 'rejected' && (
                        <button
                          onClick={() => handleApproval(ev._id, 'rejected')}
                          className="px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors"
                        >
                          Reject
                        </button>
                      )}
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

export default EventModeration;
