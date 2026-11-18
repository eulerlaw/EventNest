import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { registrationService, eventService } from '../../services/api';
import QRScannerModal from '../../components/QRScannerModal';
import StatCard from '../../components/StatCard';
import {
  Users,
  CheckCircle2,
  QrCode,
  Search,
  ArrowLeft,
  Mail,
  Calendar,
  Clock,
  ShieldCheck,
  BarChart3
} from 'lucide-react';

const ManageEvent = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [stats, setStats] = useState({ totalRegistered: 0, totalAttended: 0, attendanceRate: 0 });

  const fetchAttendeesData = async () => {
    try {
      const [evRes, attRes] = await Promise.all([
        eventService.getEventById(id),
        registrationService.getEventAttendees(id)
      ]);

      if (evRes.data.success) {
        setEvent(evRes.data.event);
      }
      if (attRes.data.success) {
        setAttendees(attRes.data.attendees);
        setStats({
          totalRegistered: attRes.data.totalRegistered,
          totalAttended: attRes.data.totalAttended,
          attendanceRate: attRes.data.attendanceRate
        });
      }
    } catch (err) {
      console.error('Error fetching event attendees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendeesData();
  }, [id]);

  const handleManualCheckIn = async (ticketId) => {
    try {
      const res = await registrationService.verifyAttendance({
        eventId: id,
        ticketId
      });
      if (res.data.success) {
        // Refresh attendee status in state
        setAttendees((prev) =>
          prev.map((a) => (a.ticketId === ticketId ? { ...a, status: 'attended', attendedAt: new Date() } : a))
        );
        setStats((prev) => ({
          ...prev,
          totalAttended: prev.totalAttended + 1,
          attendanceRate: Math.round(((prev.totalAttended + 1) / (prev.totalRegistered || 1)) * 100)
        }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Check-in failed');
    }
  };

  const filteredAttendees = attendees.filter((a) => {
    const term = search.toLowerCase();
    const nameMatch = a.user?.name?.toLowerCase().includes(term);
    const emailMatch = a.user?.email?.toLowerCase().includes(term);
    const rollMatch = a.user?.rollNumber?.toLowerCase().includes(term);
    const ticketMatch = a.ticketId?.toLowerCase().includes(term);
    return nameMatch || emailMatch || rollMatch || ticketMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/organizer"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Attendee Management & QR Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {event?.title} • {event?.venue}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <Link
            to={`/organizer/events/${id}/analytics`}
            className="px-4 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs flex items-center space-x-1.5 border border-amber-200 transition-colors"
          >
            <BarChart3 className="w-4 h-4 text-amber-600" />
            <span>Sentiment Analytics</span>
          </Link>

          <button
            onClick={() => setShowScanner(true)}
            className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center space-x-2 shadow-md shadow-brand-500/25 transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Launch QR Scanner</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Registrations" value={stats.totalRegistered} icon={Users} color="brand" />
        <StatCard title="Verified Attended" value={stats.totalAttended} icon={CheckCircle2} color="emerald" />
        <StatCard title="Attendance Rate" value={`${stats.attendanceRate}%`} icon={ShieldCheck} color="indigo" />
      </div>

      {/* Attendee Roster Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-base text-slate-900">Registered Participants</h3>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by name, roll no, or ticket..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading attendees...</div>
        ) : filteredAttendees.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No attendees found matching "{search}"
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Gate Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAttendees.map((att) => {
                  const isAttended = att.status === 'attended';
                  const isCancelled = att.status === 'cancelled';

                  return (
                    <tr key={att._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={
                              att.user?.avatar ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                att.user?.name || 'Student'
                              )}`
                            }
                            alt={att.user?.name}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{att.user?.name}</p>
                            <p className="text-[11px] text-slate-400">{att.user?.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                        {att.user?.rollNumber || 'N/A'}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">{att.user?.department}</td>

                      <td className="py-3.5 px-4 font-mono text-slate-500">{att.ticketId}</td>

                      <td className="py-3.5 px-4">
                        {isAttended ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        ) : isCancelled ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            <span>Cancelled</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                            <Clock className="w-3 h-3" />
                            <span>Registered</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {!isAttended && !isCancelled && (
                          <button
                            onClick={() => handleManualCheckIn(att.ticketId)}
                            className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition-colors"
                          >
                            Mark Attended
                          </button>
                        )}
                        {isAttended && (
                          <span className="text-[11px] text-slate-400">
                            {att.attendedAt ? new Date(att.attendedAt).toLocaleTimeString() : 'Checked-in'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        eventId={id}
        eventTitle={event?.title}
        onAttendanceMarked={(verifiedReg) => {
          setAttendees((prev) =>
            prev.map((a) =>
              a.ticketId === verifiedReg.ticketId
                ? { ...a, status: 'attended', attendedAt: verifiedReg.attendedAt }
                : a
            )
          );
          setStats((prev) => ({
            ...prev,
            totalAttended: prev.totalAttended + 1,
            attendanceRate: Math.round(((prev.totalAttended + 1) / (prev.totalRegistered || 1)) * 100)
          }));
        }}
      />
    </div>
  );
};

export default ManageEvent;
