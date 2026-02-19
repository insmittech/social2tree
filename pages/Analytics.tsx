
import React, { useMemo, useState, useEffect } from 'react';
import client from '../src/api/client';
import { UserProfile } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Users, MousePointer2, QrCode, TrendingUp, ArrowUpRight, BarChart2 } from 'lucide-react';
import { usePageSelector } from '../src/hooks/usePageSelector';
import { useAuth } from '../src/context/AuthContext';
import PageManager from '../components/PageManager';

interface AnalyticsProps {
  onLogout: () => void;
}

const Analytics: React.FC<AnalyticsProps> = ({ onLogout }) => {
  const { user: profile, updateUser } = useAuth();
  const { selectedPageId, setSelectedPageId } = usePageSelector();

  // Derived active page
  const activePage = profile?.pages?.find(p => p.id === selectedPageId) || profile?.pages?.[0] || null;

  useEffect(() => {
    if (profile && !selectedPageId && profile.pages?.length > 0) {
      setSelectedPageId(profile.pages[0].id);
    }
  }, [profile, selectedPageId, setSelectedPageId]);

  const chartData = useMemo(() => [
    { name: 'Mon', views: 120, clicks: 80 },
    { name: 'Tue', views: 240, clicks: 150 },
    { name: 'Wed', views: 300, clicks: 190 },
    { name: 'Thu', views: 280, clicks: 140 },
    { name: 'Fri', views: 420, clicks: 310 },
    { name: 'Sat', views: 550, clicks: 400 },
    { name: 'Sun', views: 480, clicks: 360 },
  ], []);

  const totalClicks = activePage?.links.reduce((acc, l) => acc + l.clicks, 0) || 0;

  if (!profile || !activePage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  const onPageCreated = (page: any) => {
    if (profile) {
      updateUser({ pages: [...profile.pages, page] });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 lg:pb-8">
      <PageManager
        pages={profile.pages}
        onPageCreated={onPageCreated}
        className="mb-8"
      />

      <header className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <BarChart2 size={28} className="text-indigo-600" />
              Analytics
            </h1>
            <p className="text-slate-500 mt-1">Performance for <span className="text-indigo-600 font-bold">@{activePage.slug}</span></p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {[
          { label: 'Lifetime Views', value: profile.views.toLocaleString(), icon: <Users size={20} />, color: 'blue', trend: '+12%' },
          { label: 'Link Clicks', value: totalClicks.toLocaleString(), icon: <MousePointer2 size={20} />, color: 'indigo', trend: '+24%' },
          { label: 'QR Scans', value: (profile as any).qrScans?.toLocaleString() || '0', icon: <QrCode size={20} />, color: 'purple', trend: 'Stable' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-[10px] sm:text-sm font-medium uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{stat.value}</h3>
              </div>
              <div className={`bg-${stat.color}-50 p-2 rounded-lg text-${stat.color}-600`}>
                {stat.icon}
              </div>
            </div>
            <div className={`mt-4 flex items-center gap-1 text-[10px] sm:text-xs font-bold ${stat.color === 'blue' || stat.color === 'indigo' ? 'text-emerald-600' : 'text-slate-400'}`}>
              {stat.color !== 'purple' && <ArrowUpRight size={14} />} {stat.trend} vs last week
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Main Traffic Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-6">Traffic Overview</h3>
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                  cursor={{ stroke: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="views" stroke="#6366f1" fillOpacity={1} fill="url(#colorViews)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Individual Links Performance */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-6">Link Performance</h3>
          <div className="space-y-6">
            {activePage.links.length > 0 ? activePage.links.map(link => {
              const percentage = Math.round((link.clicks / totalClicks) * 100) || 0;
              return (
                <div key={link.id}>
                  <div className="flex justify-between items-end mb-2">
                    <div className="text-xs sm:text-sm font-semibold text-slate-700 truncate mr-4">{link.title}</div>
                    <div className="text-[10px] sm:text-xs font-bold text-slate-500 whitespace-nowrap">{link.clicks} clicks</div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 sm:h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            }) : (
              <div className="py-10 text-center text-slate-400 font-medium italic">No links added yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
