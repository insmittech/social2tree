
import React, { useMemo, useState, useEffect } from 'react';
import client from '../src/api/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Users, MousePointer2, TrendingUp, ArrowUpRight, BarChart2, Globe, MapPin } from 'lucide-react';
import { usePageSelector } from '../src/hooks/usePageSelector';
import { useAuth } from '../src/context/AuthContext';
import PageManager from '../components/PageManager';

interface GeoCountry { country: string; country_code: string; clicks: number; }
interface GeoCity { city: string; country: string; country_code: string; clicks: number; }

// Country code → flag emoji
const flag = (code: string) => {
  if (!code || code.length !== 2) return '🌐';
  return [...code.toUpperCase()].map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)).join('');
};

const Analytics: React.FC = () => {
  const { user: profile, updateUser } = useAuth();
  const { selectedPageId, setSelectedPageId } = usePageSelector();
  const [geoCountries, setGeoCountries] = useState<GeoCountry[]>([]);
  const [geoCities, setGeoCities] = useState<GeoCity[]>([]);
  const [geoTotal, setGeoTotal] = useState(0);
  const [geoLoading, setGeoLoading] = useState(true);

  const activePage = profile?.pages?.find(p => p.id === selectedPageId) || profile?.pages?.[0] || null;

  useEffect(() => {
    if (profile && !selectedPageId && profile.pages?.length > 0) {
      setSelectedPageId(profile.pages[0].id);
    }
  }, [profile, selectedPageId, setSelectedPageId]);

  useEffect(() => {
    const fetchGeo = async () => {
      try {
        const res = await client.get('/analytics/geo.php');
        setGeoCountries(res.data.countries || []);
        setGeoCities(res.data.cities || []);
        setGeoTotal(res.data.total || 0);
      } catch {
        setGeoCountries([]);
      } finally {
        setGeoLoading(false);
      }
    };
    fetchGeo();
  }, []);

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
  const topCountry = geoCountries[0];

  if (!profile || !activePage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  const onPageCreated = (page: any) => {
    if (profile) updateUser({ pages: [...profile.pages, page] });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 lg:pb-8 space-y-8">
      <PageManager pages={profile.pages} onPageCreated={onPageCreated} className="mb-0" />

      {/* Header */}
      <header>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
          <BarChart2 size={26} className="text-indigo-600" /> Analytics
        </h1>
        <p className="text-slate-500 mt-1 font-bold text-sm">
          Performance for <span className="text-indigo-600">@{activePage.slug}</span>
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Lifetime Views', value: profile.views.toLocaleString(), icon: <Users size={20} />, color: 'bg-blue-50 text-blue-600', trend: '+12%' },
          { label: 'Link Clicks', value: totalClicks.toLocaleString(), icon: <MousePointer2 size={20} />, color: 'bg-indigo-50 text-indigo-600', trend: '+24%' },
          { label: 'Top Country', value: topCountry ? `${flag(topCountry.country_code)} ${topCountry.country}` : '—', icon: <Globe size={20} />, color: 'bg-emerald-50 text-emerald-600', trend: null },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
              </div>
              <div className={`p-2.5 rounded-2xl ${stat.color}`}>{stat.icon}</div>
            </div>
            {stat.trend && (
              <div className="mt-3 flex items-center gap-1 text-xs font-bold text-emerald-600">
                <ArrowUpRight size={14} /> {stat.trend} vs last week
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Traffic Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-black text-slate-800 mb-6 text-sm uppercase tracking-widest">Traffic Overview</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -5px rgb(0 0 0 / 0.15)', fontSize: '12px' }} cursor={{ stroke: '#e2e8f0' }} />
                <Area type="monotone" dataKey="views" stroke="#6366f1" fillOpacity={1} fill="url(#colorViews)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Link Performance */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-black text-slate-800 mb-6 text-sm uppercase tracking-widest">Link Performance</h3>
          <div className="space-y-5">
            {activePage.links.length > 0 ? activePage.links.map(link => {
              const pct = Math.round((link.clicks / Math.max(totalClicks, 1)) * 100);
              return (
                <div key={link.id}>
                  <div className="flex justify-between items-end mb-1.5">
                    <p className="text-sm font-bold text-slate-700 truncate mr-4">{link.title}</p>
                    <p className="text-xs font-bold text-slate-400 whitespace-nowrap">{link.clicks} clicks</p>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            }) : (
              <div className="py-10 text-center text-slate-400 font-bold italic text-sm">No links added yet</div>
            )}
          </div>
        </div>
      </div>

      {/* === GEO ANALYTICS === */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Countries */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest flex items-center gap-2">
              <Globe size={16} className="text-indigo-500" /> Visitors by Country
            </h3>
            {geoTotal > 0 && (
              <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-widest">
                {geoTotal} tracked clicks
              </span>
            )}
          </div>

          {geoLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
            </div>
          ) : geoCountries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-300">
              <Globe size={40} className="mb-3" />
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">No geo data yet</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Data appears as visitors click your links</p>
            </div>
          ) : (
            <div className="space-y-3">
              {geoCountries.map((c, i) => {
                const pct = geoTotal > 0 ? Math.round((c.clicks / geoTotal) * 100) : 0;
                return (
                  <div key={c.country_code} className="flex items-center gap-4">
                    <span className="text-xl w-7 flex-shrink-0">{flag(c.country_code)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-bold text-slate-700 truncate">{c.country}</p>
                        <p className="text-xs font-black text-slate-500 ml-3 flex-shrink-0">{c.clicks} <span className="text-slate-300">({pct}%)</span></p>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            background: `hsl(${240 - i * 15}, 85%, ${55 + i * 3}%)`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Cities */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest flex items-center gap-2 mb-6">
            <MapPin size={16} className="text-violet-500" /> Top Cities
          </h3>

          {geoLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-violet-500 border-t-transparent" />
            </div>
          ) : geoCities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-300">
              <MapPin size={32} className="mb-3" />
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">No data yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {geoCities.map((c, i) => (
                <div key={`${c.city}-${i}`} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base flex-shrink-0">{flag(c.country_code)}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-700 truncate">{c.city}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.country}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full flex-shrink-0">
                    {c.clicks}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
