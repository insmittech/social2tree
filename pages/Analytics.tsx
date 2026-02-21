import React, { useMemo, useState, useEffect } from 'react';
import client from '../src/api/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Users, MousePointer2, TrendingUp, ArrowUpRight, BarChart2, Globe, MapPin, Monitor, Smartphone, Compass, Activity, ShieldCheck, Zap } from 'lucide-react';
import { usePageSelector } from '../src/hooks/usePageSelector';
import { useAuth } from '../src/context/AuthContext';
import PageManager from '../components/PageManager';

interface GeoCountry { country: string; country_code: string; clicks: number; }
interface GeoCity { city: string; country: string; country_code: string; clicks: number; }
interface TimelineData { date: string; views: number; clicks: number; }
interface StatItem { name: string; value: number; }
interface ActivityEvent { id: number; event_type: string; country: string; city: string; country_code: string; created_at: string; }

const flag = (code: string) => {
  if (!code || code.length !== 2) return '🌐';
  return [...code.toUpperCase()].map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)).join('');
};

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b'];

const Analytics: React.FC = () => {
  const { user: profile, updateUser } = useAuth();
  const { selectedPageId, setSelectedPageId } = usePageSelector();

  // Advanced States
  const [timeline, setTimeline] = useState<TimelineData[]>([]);
  const [browsers, setBrowsers] = useState<StatItem[]>([]);
  const [devices, setDevices] = useState<StatItem[]>([]);
  const [referrers, setReferrers] = useState<StatItem[]>([]);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [totals, setTotals] = useState<any>(null);

  const [geoCountries, setGeoCountries] = useState<GeoCountry[]>([]);
  const [geoCities, setGeoCities] = useState<GeoCity[]>([]);
  const [geoTotal, setGeoTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const activePage = profile?.pages?.find(p => p.id === selectedPageId) || profile?.pages?.[0] || null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [geoRes, advancedRes] = await Promise.all([
          client.get('/analytics/geo.php').catch(e => ({ data: { countries: [], cities: [], total: 0 } })),
          client.get('/analytics/advanced_stats.php').catch(e => ({ data: { timeline: [], browsers: [], devices: [], referrers: [], activity: [], totals: null } }))
        ]);

        setGeoCountries(geoRes.data.countries || []);
        setGeoCities(geoRes.data.cities || []);
        setGeoTotal(geoRes.data.total || 0);

        setTimeline(advancedRes.data.timeline || []);
        setBrowsers(advancedRes.data.browsers || []);
        setDevices(advancedRes.data.devices || []);
        setReferrers(advancedRes.data.referrers || []);
        setActivity(advancedRes.data.activity || []);
        setTotals(advancedRes.data.totals || null);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalClicks = activePage?.links.reduce((acc, l) => acc + l.clicks, 0) || 0;

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
    <div className="max-w-7xl mx-auto px-4 py-8 pb-32 space-y-8">
      <PageManager pages={profile.pages} onPageCreated={onPageCreated} className="mb-0 overflow-x-auto no-scrollbar" />

      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <ShieldCheck size={28} className="text-indigo-600" /> Intelligence Operations
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-bold text-sm uppercase tracking-widest">
            Profile: <span className="text-indigo-600">@{activePage.slug}</span> // Sector: {geoCountries[0]?.country || 'Unknown'}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/5 dark:bg-slate-800/50 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Activity size={16} className="text-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-tighter">System Live</span>
        </div>
      </header>

      {/* Stats - Tactical Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Signal views', value: (totals?.total_events || totals?.total_views || profile.views).toLocaleString(), icon: <Zap size={18} /> },
          { label: 'Unique Subjects', value: (totals?.unique_visitors || Math.round((totals?.total_views || profile.views) * 0.8)).toLocaleString(), icon: <Users size={18} /> },
          { label: 'Node Interactions', value: (totals?.node_interactions || totalClicks).toLocaleString(), icon: <MousePointer2 size={18} /> },
          { label: 'Urban Coverage', value: (totals?.total_cities || 0).toLocaleString(), icon: <MapPin size={18} /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900/40 p-4 rounded-[1.5rem] border border-slate-100 dark:border-slate-800/50">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.label}</p>
            <div className="flex items-center justify-between mt-1">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
              <div className="text-indigo-500 opacity-50">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Intel Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Timeline Tracking */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/40 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800/50">
          <h3 className="font-black text-slate-800 dark:text-slate-200 mb-6 text-xs uppercase tracking-[0.2em] flex items-center gap-2">
            <TrendingUp size={14} className="text-indigo-500" /> Temporal Signal Distribution
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b10" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ fontWeight: 'black', textTransform: 'uppercase', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="views" stroke="#6366f1" fillOpacity={1} fill="url(#colorViews)" strokeWidth={3} />
                <Area type="monotone" dataKey="clicks" stroke="#ec4899" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Tactical Feed */}
        <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800/50 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
          <h3 className="font-bold text-indigo-400 mb-4 text-[10px] uppercase tracking-[0.3em] flex items-center justify-between">
            Tactical Monitor <Activity size={14} className="animate-pulse" />
          </h3>
          <div className="space-y-4 max-h-[320px] overflow-y-auto no-scrollbar">
            {activity.map((ev) => (
              <div key={ev.id} className="font-mono text-[9px] border-l-2 border-indigo-500/30 pl-3 py-1 bg-indigo-500/5">
                <div className="flex justify-between text-indigo-300">
                  <span>[{new Date(ev.created_at).toLocaleTimeString()}] INTERCEPTION</span>
                  <span className="opacity-50 text-[8px]">{ev.event_type.replace('_', ' ').toUpperCase()}</span>
                </div>
                <div className="text-slate-400 mt-0.5">
                  FROM: <span className="text-slate-200">{ev.city || 'Sector Unknown'}</span> //
                  CODE: <span className="text-slate-200">{ev.country_code}</span> {flag(ev.country_code)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800 text-[8px] font-mono text-slate-500 uppercase tracking-tighter">
            Real-time feed active • Encryption: SHA-256
          </div>
        </div>
      </div>

      {/* Breakdowns Row */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Hardware Signature */}
        <div className="bg-white dark:bg-slate-900/40 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800/50">
          <h3 className="font-black text-slate-800 dark:text-slate-200 mb-4 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
            <Monitor size={14} className="text-blue-500" /> Client Tech
          </h3>
          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={devices} innerRadius={35} outerRadius={55} paddingAngle={5} dataKey="value">
                  {devices.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {devices.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-[10px] font-black uppercase text-slate-500">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Source Vectors */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/40 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800/50">
          <h3 className="font-black text-slate-800 dark:text-slate-200 mb-6 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
            <Compass size={14} className="text-orange-500" /> Entry Vectors
          </h3>
          <div className="space-y-4">
            {referrers.map((ref, i) => (
              <div key={i}>
                <div className="flex justify-between text-[11px] font-bold mb-1 uppercase tracking-tighter">
                  <span className="text-slate-600 dark:text-slate-400">{ref.name}</span>
                  <span className="text-indigo-600">{ref.value} Hits</span>
                </div>
                <div className="h-1.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 opacity-50" style={{ width: `${(ref.value / Math.max(...referrers.map(r => r.value), 1)) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Distribution Summary */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-[2rem] shadow-xl text-white overflow-hidden relative">
          <Globe size={120} className="absolute -right-10 -bottom-10 opacity-10 rotate-12" />
          <h3 className="font-black text-[10px] uppercase tracking-[0.2em] mb-4 opacity-70">Top Sector</h3>
          {geoCountries[0] ? (
            <div>
              <div className="text-5xl mb-2">{flag(geoCountries[0].country_code)}</div>
              <p className="text-xl font-black">{geoCountries[0].country}</p>
              <p className="text-xs font-bold opacity-70 mt-1 uppercase tracking-widest">{geoCountries[0].clicks} Signal Hits</p>
            </div>
          ) : (
            <div className="h-20 flex items-center justify-center font-mono text-[10px] opacity-50 italic">Establishing connection...</div>
          )}
        </div>
      </div>

      {/* Origin Intel Dashboard */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/40 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 p-6">
          <h3 className="font-black text-slate-800 dark:text-slate-200 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 mb-6">
            <MapPin size={14} className="text-indigo-500" /> Origin Intersections
          </h3>
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-4">
              {geoCountries.slice(0, 5).map((c, i) => (
                <div key={`${c.country_code}-${i}`} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{flag(c.country_code)}</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-500 transition-colors uppercase">{c.country}</span>
                  </div>
                  <span className="text-[10px] font-black bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-lg opacity-50">{c.clicks}</span>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {geoCities.slice(0, 5).map((c, i) => (
                <div key={`${c.city}-${i}`} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-3">
                    <MapPin size={12} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase truncate max-w-[120px]">{c.city}</span>
                  </div>
                  <span className="text-[10px] font-black bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-lg opacity-50">{c.clicks}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 flex flex-col justify-center">
          <div className="text-center">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">Global Coverage</p>
            <div className="text-4xl font-black text-indigo-600 mb-2">{geoCountries.length}</div>
            <p className="text-[10px] font-bold text-indigo-500/70 uppercase">Nations Intersected</p>
            <div className="mt-8 flex justify-center -space-x-2">
              {geoCountries.slice(0, 5).map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-white border-2 border-indigo-50 flex items-center justify-center text-sm shadow-sm">
                  {flag(c.country_code)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
