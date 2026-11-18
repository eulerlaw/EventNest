import React, { useState, useEffect } from 'react';
import { recommendationService, registrationService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import EventCard from '../../components/EventCard';
import QRPassModal from '../../components/QRPassModal';
import { Sparkles, Brain, BookOpen, Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecommendedEvents = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeredEventIds, setRegisteredEventIds] = useState(new Set());
  const [activePass, setActivePass] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recRes, regRes] = await Promise.all([
          recommendationService.getRecommendations(12),
          registrationService.getMyRegistrations()
        ]);

        if (recRes.data.success) {
          setRecommendations(recRes.data.recommendations);
        }
        if (regRes.data.success) {
          const ids = new Set(
            regRes.data.registrations
              .filter((r) => r.status === 'registered' || r.status === 'attended')
              .map((r) => r.event?._id)
          );
          setRegisteredEventIds(ids);
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRegister = async (eventId) => {
    try {
      const res = await registrationService.register(eventId);
      if (res.data.success) {
        setRegisteredEventIds((prev) => new Set([...prev, eventId]));
        const targetEvent = recommendations.find((r) => r.event._id === eventId)?.event;
        setActivePass({
          ...res.data.registration,
          event: targetEvent,
          qrCodeImage: res.data.qrCodeImage
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Content-Based Recommendation Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Personalized Recommendations
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Events mathematically ranked for you using TF-IDF (Term Frequency-Inverse Document Frequency) vectorization and Cosine Similarity, based on your stated interests and academic department.
        </p>
      </div>

      {/* Algorithm Transparency & Viva Information Card */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-7 text-white shadow-lg space-y-4">
        <div className="flex items-center space-x-2.5">
          <Brain className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold tracking-wide uppercase text-amber-300">
            Algorithm Architecture (B.Tech Minor Project Methodology)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 space-y-1">
            <span className="font-bold text-white block">1. Student Profile Vector</span>
            <p className="text-slate-400 leading-relaxed">
              Synthesizes student interests ({user?.interests?.length || 0} tags), department ({user?.department}), and past attended event history into a weighted term frequency vector.
            </p>
          </div>
          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 space-y-1">
            <span className="font-bold text-white block">2. Event Feature Vector</span>
            <p className="text-slate-400 leading-relaxed">
              Tokenizes event title, category, tags, and description. Cleans punctuation, removes stop words, and weighs terms with smooth corpus inverse document frequency (IDF).
            </p>
          </div>
          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 space-y-1">
            <span className="font-bold text-white block">3. Cosine Similarity Ranking</span>
            <p className="text-slate-400 leading-relaxed">
              Calculates cosine of angle between profile vector and event vector: cos(θ) = (A · B) / (||A|| ||B||). Results are sorted in descending order of relevance.
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs border-t border-white/10">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Your Active Feature Weights:</span>
            {(user?.interests || []).map((int, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono text-[11px]">
                {int}
              </span>
            ))}
          </div>
          <Link to="/student/profile" className="text-amber-400 hover:text-amber-300 font-bold">
            Edit Interests →
          </Link>
        </div>
      </div>

      {/* Recommended Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-80 bg-slate-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
          <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No New Recommendations Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You might already be registered for available matching events or your profile needs more interests selected.
          </p>
          <Link to="/student/profile" className="inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold">
            Update Profile Interests
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((item) => (
            <EventCard
              key={item.event._id}
              event={item.event}
              similarityScore={item.similarityScore}
              matchReasons={item.matchReasons}
              onRegister={handleRegister}
              isRegistered={registeredEventIds.has(item.event._id)}
            />
          ))}
        </div>
      )}

      {/* QR Pass Modal */}
      {activePass && (
        <QRPassModal
          isOpen={!!activePass}
          onClose={() => setActivePass(null)}
          registration={activePass}
        />
      )}
    </div>
  );
};

export default RecommendedEvents;
