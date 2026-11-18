import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../services/api';
import EventCard from '../components/EventCard';
import {
  Calendar,
  Sparkles,
  ShieldCheck,
  BarChart3,
  QrCode,
  ArrowRight,
  CheckCircle,
  Users,
  GraduationCap,
  MessageSquare
} from 'lucide-react';

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await eventService.getEvents({ limit: 3, sort: 'popular' });
        if (res.data.success) {
          setFeaturedEvents(res.data.events);
        }
      } catch (err) {
        console.error('Failed to load featured events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold animate-in fade-in duration-300">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI-Powered Campus Event Discovery & Sentiment Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Experience Campus Events with{' '}
              <span className="bg-gradient-to-r from-brand-600 via-brand-700 to-indigo-600 bg-clip-text text-transparent">
                Intelligence
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              EventNest transforms college event management at GTBIT — combining TF-IDF personalized recommendations, cryptographic QR attendance passes, and VADER-driven sentiment feedback analytics.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                to="/explore"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-brand-500/25 transition-all duration-200 hover:-translate-y-0.5"
              >
                <span>Explore Events</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 shadow-xs transition-all duration-200 hover:-translate-y-0.5"
              >
                Create Student Account
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 max-w-3xl mx-auto border-t border-slate-200/80">
              <div>
                <p className="text-2xl font-black text-slate-900">100%</p>
                <p className="text-xs text-slate-500 font-medium">Verifiable QR Passes</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">TF-IDF</p>
                <p className="text-xs text-slate-500 font-medium">Cosine Recommendations</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">VADER</p>
                <p className="text-xs text-slate-500 font-medium">Lexicon Sentiment NLP</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">3 Roles</p>
                <p className="text-xs text-slate-500 font-medium">Student / Org / Admin</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Architectural Highlights (From Synopsis) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
            System Architecture & Methodology
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Engineered Beyond Static Portals
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">
              Content-Based Recommendations
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Computes TF-IDF feature vectors from event titles, tags, and descriptions. Ranks upcoming events against the student's stated interests and department using Cosine Similarity.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <QrCode className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">
              Verifiable Cryptographic Passes
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Server-side HMAC-SHA256 signatures embed tamper-proof credentials in each student's QR pass. Organizers verify attendance live without relying on arbitrary QR content.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">
              VADER Feedback Sentiment NLP
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Analyzes post-event free-text feedback into Positive, Neutral, or Negative labels with compound scoring and extracts recurring themes like Venue, Timing, Content & Speaker.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
              Live on Campus
            </h2>
            <h3 className="text-2xl font-extrabold text-slate-900">Featured Events</h3>
          </div>
          <Link
            to="/explore"
            className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-slate-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : featuredEvents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
            <p className="text-sm text-slate-500">No featured events currently scheduled.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
