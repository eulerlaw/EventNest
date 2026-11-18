import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { feedbackService } from '../../services/api';
import SentimentBadge from '../../components/SentimentBadge';
import StatCard from '../../components/StatCard';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import {
  Sparkles,
  Star,
  MessageSquare,
  Smile,
  Meh,
  Frown,
  ArrowLeft,
  Tag,
  Layers,
  Brain
} from 'lucide-react';

const COLORS = {
  positive: '#10b981', // Emerald
  neutral: '#64748b',  // Slate
  negative: '#f43f5e'  // Rose
};

const EventAnalytics = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await feedbackService.getEventFeedback(id);
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Error fetching event sentiment analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-slate-500">Computing VADER sentiment analytics...</p>
      </div>
    );
  }

  if (!data || !data.event) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Event Analytics Not Found</h2>
        <Link to="/organizer" className="text-xs font-bold text-brand-600">
          Back to Organizer Dashboard
        </Link>
      </div>
    );
  }

  const { event, analytics, feedbacks } = data;

  const pieChartData = [
    { name: 'Positive', value: analytics.distribution.positive, color: COLORS.positive },
    { name: 'Neutral', value: analytics.distribution.neutral, color: COLORS.neutral },
    { name: 'Negative', value: analytics.distribution.negative, color: COLORS.negative }
  ].filter((d) => d.value > 0);

  const themeChartData = (analytics.topThemes || []).map((t) => ({
    name: t.name,
    count: t.count
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Header */}
      <div>
        <Link
          to={`/organizer/events/${id}/attendees`}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Attendee Management</span>
        </Link>
        <div className="flex items-center space-x-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Brain className="w-4 h-4" />
          <span>VADER Opinion Mining & Sentiment Analysis</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Feedback Sentiment Report
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {event.title} • {event.category}
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Average Star Rating"
          value={`${analytics.averageRating} ⭐`}
          icon={Star}
          color="amber"
        />
        <StatCard
          title="Total Reviews"
          value={analytics.totalFeedback}
          icon={MessageSquare}
          color="brand"
        />
        <StatCard
          title="Positive Sentiments"
          value={`${analytics.percentages.positive}%`}
          icon={Smile}
          color="emerald"
        />
        <StatCard
          title="Negative / Critical"
          value={`${analytics.percentages.negative}%`}
          icon={Frown}
          color="rose"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sentiment Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              Sentiment Distribution (Positive / Neutral / Negative)
            </h3>
            <span className="text-xs text-slate-400">VADER Compound Score</span>
          </div>

          {pieChartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400">
              No feedback collected yet to generate sentiment chart
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <p className="font-bold">{analytics.distribution.positive} ({analytics.percentages.positive}%)</p>
              <span className="text-[10px] text-emerald-600">Positive</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 text-slate-700">
              <p className="font-bold">{analytics.distribution.neutral} ({analytics.percentages.neutral}%)</p>
              <span className="text-[10px] text-slate-500">Neutral</span>
            </div>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-800">
              <p className="font-bold">{analytics.distribution.negative} ({analytics.percentages.negative}%)</p>
              <span className="text-[10px] text-rose-600">Negative</span>
            </div>
          </div>
        </div>

        {/* Recurring Themes Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Detected Feedback Themes</h3>
            <span className="text-xs text-slate-400">Domain Classification</span>
          </div>

          {themeChartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400">
              No thematic keywords detected in attendee comments
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={themeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Common Keywords Cloud */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              High-Frequency Sentiment Keywords:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(analytics.commonKeywords || []).map((item, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  {item.word} <span className="text-brand-600">×{item.count}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Individual Feedback Comments Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden p-6 space-y-4">
        <h3 className="font-bold text-base text-slate-900">Attendee Reviews & Classified Sentiments</h3>

        {feedbacks.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No reviews submitted for this event yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Attendee</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Review Text</th>
                  <th className="py-3 px-4">VADER Sentiment</th>
                  <th className="py-3 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {feedbacks.map((fb) => (
                  <tr key={fb._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {fb.user?.name}
                      <span className="block text-[11px] text-slate-400 font-normal">
                        {fb.user?.department}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1 font-bold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{fb.rating}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 max-w-md">
                      <p className="leading-relaxed italic">"{fb.commentText}"</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <SentimentBadge
                        label={fb.sentiment?.label}
                        score={fb.sentiment?.score}
                        showScore
                      />
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-400 text-[11px]">
                      {new Date(fb.createdAt).toLocaleDateString()}
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

export default EventAnalytics;
