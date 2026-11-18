import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { recommendationService, registrationService } from '../../services/api';
import StatCard from '../../components/StatCard';
import EventCard from '../../components/EventCard';
import QRPassModal from '../../components/QRPassModal';
import {
  Sparkles,
  Ticket,
  Calendar,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Compass,
  AlertCircle
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPass, setSelectedPass] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [recRes, regRes] = await Promise.all([
          recommendationService.getRecommendations(3),
          registrationService.getMyRegistrations()
        ]);

        if (recRes.data.success) {
          setRecommendations(recRes.data.recommendations);
        }
        if (regRes.data.success) {
          setRegistrations(regRes.data.registrations);
        }
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const activeRegistrations = registrations.filter(
    (r) => r.status === 'registered' && new Date(r.event?.dateTime) >= new Date()
  );
  const attendedRegistrations = registrations.filter((r) => r.status === 'attended');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-brand-200 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>{user?.department || 'Department of Information Technology'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-brand-100 leading-relaxed">
            Your personalized campus hub is active. Browse TF-IDF tailored event recommendations, manage your digital QR passes, and provide post-event feedback.
          </p>
          <div className="pt-2 flex flex-wrap gap-2">
            {(user?.interests || []).slice(0, 4).map((interest, i) => (
              <span key={i} className="text-[11px] bg-brand-700/60 text-brand-200 px-2.5 py-1 rounded-lg font-medium">
                #{interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Registrations"
          value={activeRegistrations.length}
          icon={Ticket}
          color="brand"
        />
        <StatCard
          title="Events Attended"
          value={attendedRegistrations.length}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Personalized Matches"
          value={recommendations.length}
          icon={Sparkles}
          color="amber"
        />
        <StatCard
          title="Stated Interests"
          value={user?.interests?.length || 0}
          icon={BookOpen}
          color="indigo"
        />
      </div>

      {/* Recommended For You Section (TF-IDF) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Recommended For You</h2>
              <p className="text-[11px] text-slate-500">TF-IDF Vector Matching against your Interests & Department</p>
            </div>
          </div>
          <Link
            to="/student/recommended"
            className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center space-x-1"
          >
            <span>View All Matches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-72 bg-slate-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : recommendations.length === 0 ? (
          <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-2">
            <p className="text-xs text-slate-500">No new recommendations available at the moment.</p>
            <Link to="/explore" className="inline-block text-xs font-bold text-brand-600 hover:underline">
              Explore all campus events →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((item) => (
              <EventCard
                key={item.event._id}
                event={item.event}
                similarityScore={item.similarityScore}
                matchReasons={item.matchReasons}
              />
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Active Passes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">My Active Passes</h2>
              <p className="text-[11px] text-slate-500">Cryptographically signed digital entry passes</p>
            </div>
          </div>
          <Link
            to="/student/registrations"
            className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center space-x-1"
          >
            <span>Manage All Passes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {activeRegistrations.length === 0 ? (
          <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-2">
            <Ticket className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No Active Passes</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't registered for any upcoming events yet. Browse events and grab your pass!
            </p>
            <Link to="/explore" className="inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700">
              Explore Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeRegistrations.slice(0, 2).map((reg) => (
              <div
                key={reg._id}
                className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between"
              >
                <div className="space-y-1 max-w-[70%]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                    {reg.event?.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {reg.event?.title}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {new Date(reg.event?.dateTime).toLocaleDateString()} • {reg.event?.venue}
                  </p>
                  <span className="inline-block text-[10px] text-slate-400 font-mono">
                    Ticket #{reg.ticketId}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedPass(reg)}
                  className="px-3.5 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold transition-colors flex items-center space-x-1"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>View QR</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Pass Modal */}
      {selectedPass && (
        <QRPassModal
          isOpen={!!selectedPass}
          onClose={() => setSelectedPass(null)}
          registration={selectedPass}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
