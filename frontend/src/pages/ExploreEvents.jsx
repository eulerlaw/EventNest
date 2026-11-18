import React, { useState, useEffect, useCallback } from 'react';
import { eventService, registrationService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import QRPassModal from '../components/QRPassModal';
import { Search, Filter, Calendar, RefreshCw } from 'lucide-react';

const CATEGORIES = ['All', 'Technical', 'Hackathon', 'Workshop', 'Cultural', 'Sports', 'Seminar'];

const ExploreEvents = () => {
  const { isAuthenticated, isStudent } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('dateTime');
  const [registeredEventIds, setRegisteredEventIds] = useState(new Set());
  const [activeRegistrationPass, setActiveRegistrationPass] = useState(null);
  const [showPassModal, setShowPassModal] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        category: selectedCategory,
        search: search.trim() || undefined,
        sort: sortBy === 'dateTime' ? undefined : sortBy,
        status: 'published'
      };
      const res = await eventService.getEvents(params);
      if (res.data.success) {
        setEvents(res.data.events);
      }

      // If logged in student, fetch their registrations to mark registered status
      if (isAuthenticated && isStudent) {
        const regRes = await registrationService.getMyRegistrations();
        if (regRes.data.success) {
          const ids = new Set(
            regRes.data.registrations
              .filter((r) => r.status === 'registered' || r.status === 'attended')
              .map((r) => r.event?._id)
          );
          setRegisteredEventIds(ids);
        }
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, search, sortBy, isAuthenticated, isStudent]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchEvents]);

  const handleRegister = async (eventId) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    try {
      const res = await registrationService.register(eventId);
      if (res.data.success) {
        setRegisteredEventIds((prev) => new Set([...prev, eventId]));
        // Refresh event to increment count
        setEvents((prev) =>
          prev.map((e) =>
            e._id === eventId ? { ...e, registeredCount: (e.registeredCount || 0) + 1 } : e
          )
        );
        setActiveRegistrationPass({
          ...res.data.registration,
          event: events.find((e) => e._id === eventId),
          qrCodeImage: res.data.qrCodeImage
        });
        setShowPassModal(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore Campus Events</h1>
        <p className="text-xs text-slate-500 mt-1">
          Discover hackathons, guest lectures, technical workshops, and cultural fests at GTBIT
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by event title, tags, venue, or keywords..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
            />
          </div>

          {/* Sort Selector */}
          <div className="w-full md:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="dateTime">Sort: Upcoming Date</option>
              <option value="popular">Sort: Most Popular</option>
              <option value="rating">Sort: Highest Rated</option>
              <option value="newest">Sort: Recently Added</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Event Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-80 bg-slate-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No events matched your criteria</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, switching categories, or clearing filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onRegister={isStudent ? handleRegister : null}
              isRegistered={registeredEventIds.has(event._id)}
            />
          ))}
        </div>
      )}

      {/* QR Pass Confirmation Modal */}
      <QRPassModal
        isOpen={showPassModal}
        onClose={() => setShowPassModal(false)}
        registration={activeRegistrationPass}
      />
    </div>
  );
};

export default ExploreEvents;
