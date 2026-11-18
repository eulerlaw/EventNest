import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/api';
import StatCard from '../../components/StatCard';
import SentimentBadge from '../../components/SentimentBadge';
import {
  Users,
  Calendar,
  Ticket,
  ShieldCheck,
  CheckCircle2,
  BarChart3,
  MessageSquare,
  Smile,
  ExternalLink,
  UserCheck
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const SENTIMENT_COLORS = ['#10b981', '#64748b', '#f43f5e'];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await adminService.getStats();
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-slate-500">Loading campus-wide metrics...</p>
      </div>
    );
  }

  const { stats, categoryStats, sentimentStats, recentRegistrations } = data || {};

  const sentimentPieData = [
    { name: 'Positive', value: sentimentStats?.counts?.positive || 0 },
    { name: 'Neutral', value: sentimentStats?.counts?.neutral || 0 },
    { name: 'Negative', value: sentimentStats?.counts?.negative || 0 }
  ].filter((d) => d.value > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Campus Administrative Operations Hub</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            EventNest Central Administration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global metrics for Guru Tegh Bahadur Institute of Technology campus activities
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/users"
            className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-colors"
          >
            <UserCheck className="w-4 h-4 text-indigo-600" />
            <span>Manage Users</span>
          </Link>
          <Link
            to="/admin/events"
            className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-brand-500/25 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>Event Moderation</span>
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Students" value={stats?.totalStudents || 0} icon={Users} color="brand" />
        <StatCard title="Authorized Organizers" value={stats?.totalOrganizers || 0} icon={ShieldCheck} color="indigo" />
        <StatCard title="Total Registrations" value={stats?.totalRegistrations || 0} icon={Ticket} color="amber" />
        <StatCard title="Verified Attendance" value={`${stats?.overallAttendanceRate || 0}%`} icon={CheckCircle2} color="emerald" />
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Registrations Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              Registrations by Category
            </h3>
            <span className="text-xs text-slate-400">Demand Distribution</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryStats || []} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="category" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="registrations" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Sentiment Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              Platform-Wide Sentiment Analysis
            </h3>
            <span className="text-xs text-slate-400">VADER Compound Mining</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {sentimentPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[index % SENTIMENT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <p className="font-bold">{sentimentStats?.percentages?.positive || 0}%</p>
              <span className="text-[10px] text-emerald-600">Positive Feedback</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 text-slate-700">
              <p className="font-bold">{sentimentStats?.percentages?.neutral || 0}%</p>
              <span className="text-[10px] text-slate-500">Neutral Feedback</span>
            </div>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-800">
              <p className="font-bold">{sentimentStats?.percentages?.negative || 0}%</p>
              <span className="text-[10px] text-rose-600">Needs Improvement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Platform Registrations Stream */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden p-6 space-y-4">
        <h3 className="font-bold text-base text-slate-900">Recent Campus Activity</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Event Registered</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(recentRegistrations || []).map((reg) => (
                <tr key={reg._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{reg.user?.name}</td>
                  <td className="py-3 px-4 text-slate-600">{reg.user?.department}</td>
                  <td className="py-3 px-4 font-semibold text-brand-700">{reg.event?.title}</td>
                  <td className="py-3 px-4 font-medium text-slate-600">{reg.event?.category}</td>
                  <td className="py-3 px-4 text-right text-slate-400">
                    {new Date(reg.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
