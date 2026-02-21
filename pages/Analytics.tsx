import React, { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import client from '../src/api/client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
  Users, MousePointer2, TrendingUp, BarChart2, Globe, MapPin,
  Monitor, Smartphone, Compass, Activity, ShieldCheck, Zap,
  Calendar, Filter, ChevronRight, Search, List, LayoutGrid,
  Clock, Server, Cpu, Globe2
} from 'lucide-react';
import { usePageSelector } from '../src/hooks/usePageSelector';
import { useAuth } from '../src/context/AuthContext';
import PageManager from '../components/PageManager';

interface GeoCountry { country: string; country_code: string; clicks: number; }
interface GeoCity { city: string; country: string; country_code: string; clicks: number; }
interface TimelineData { date: string; views: number; clicks: number; }
interface StatItem { name: string; value: number; }
interface ActivityEvent { id: number; event_type: string; country: string; city: string; country_code: string; isp: string; org: string; created_at: string; }

const flag = (code: string) => {
  if (!code || code.length !== 2) return '🌐';
  return [...code.toUpperCase()].map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)).join('');
};

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4'];

const Analytics: React.FC = () => {
  const { user: profile, updateUser } = useAuth();
  const { selectedPageId, setSelectedPageId } = usePageSelector();
  const location = useLocation();
  const currentPath = location.pathname;

  // Filters State
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedLink, setSelectedLink] = useState<string>('all');

  // Data State
  const [timeline, setTimeline] = useState<TimelineData[]>([]);
  const [browsers, setBrowsers] = useState<StatItem[]>([]);
  const [devices, setDevices] = useState<StatItem[]>([]);
  const [referrers, setReferrers] = useState<StatItem[]>([]);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [totals, setTotals] = useState<any>(null);
  const [geoCountries, setGeoCountries] = useState<GeoCountry[]>([]);
  const [geoCities, setGeoCities] = useState<GeoCity[]>([]);
  const [loading, setLoading] = useState(true);

  const activePage = profile?.pages?.find(p => p.id === selectedPageId) || profile?.pages?.[0] || null;

  const fetchData = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedPageId) params.page_id = selectedPageId;
      if (selectedLink !== 'all') params.link_id = selectedLink;
      if (dateRange.start) params.start_date = dateRange.start;
      if (dateRange.end) params.end_date = dateRange.end;

      const [geoRes, advancedRes] = await Promise.all([
        client.get('/analytics/geo.php', { params }).catch(e => ({ data: { countries: [], cities: [], total: 0 } })),
        client.get('/analytics/advanced_stats.php', { params }).catch(e => ({ data: { timeline: [], browsers: [], devices: [], referrers: [], activity: [], totals: null } }))
      ]);

      setGeoCountries(geoRes.data.countries || []);
      setGeoCities(geoRes.data.cities || []);
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

  useEffect(() => {
    fetchData();
  }, [selectedPageId, selectedLink, dateRange]);

  const viewType = useMemo(() => {
    if (currentPath.endsWith('/traffic')) return 'traffic';
    if (currentPath.endsWith('/info')) return 'info';
    if (currentPath.endsWith('/geo')) return 'geo';
    return 'overview';
  }, [currentPath]);

  if (!profile || !activePage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05080f] pb-24 font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Navigation & Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
              <BarChart2 className="text-indigo-600 w-8 h-8" />
              {viewType === 'overview' && 'Analytics Overview'}
              {viewType === 'traffic' && 'Traffic Analysis'}
              {viewType === 'info' && 'Device Intelligence'}
              {viewType === 'geo' && 'Geographical Map'}
            </h1>
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">
              <span className="flex items-center gap-1.5 ring-1 ring-slate-200 dark:ring-slate-800 px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Monitoring
              </span>
              <span className="text-indigo-600">@{activePage.slug}</span>
            </div>
          </div>

          <PageManager
            pages={profile.pages}
            onPageCreated={(p) => updateUser({ pages: [...profile.pages, p] })}
            className="mb-0 overflow-visible"
          />
        </div>

        {/* Filters Panel */}
        <div className="bg-white dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 shadow-sm backdrop-blur-xl">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-3 flex-1 w-full md:w-auto">
              <div className="bg-indigo-600/10 p-2.5 rounded-2xl text-indigo-600">
                <Filter size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Filter by Node</p>
                <select
                  value={selectedLink}
                  onChange={(e) => setSelectedLink(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none appearance-none"
                >
                  <option value="all">All Signals (Page Views + All Links)</option>
                  {activePage.links.map(l => (
                    <option key={l.id} value={l.id}>{l.title || 'Untitled Node'}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="h-10 w-px bg-slate-100 dark:bg-slate-800 hidden md:block" />

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex-1 md:w-40">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Start Point</p>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none"
                />
              </div>
              <div className="flex-1 md:w-40">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">End Point</p>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- DYNAMIC VIEWS --- */}

        {viewType === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Intersections', value: totals?.total_events || 0, icon: <Zap className="text-amber-500" />, sub: 'Signal Count' },
                { label: 'Unique Subjects', value: totals?.unique_visitors || 0, icon: <Users className="text-indigo-500" />, sub: 'Distinct IPs' },
                { label: 'Node Interactions', value: totals?.node_interactions || 0, icon: <MousePointer2 className="text-rose-500" />, sub: 'Total Clicks' },
                { label: 'Urban Coverage', value: totals?.total_cities || 0, icon: <MapPin className="text-emerald-500" />, sub: 'Cities Identified' },
              ].map((stat, i) => (
                <div key={i} className="group bg-white dark:bg-slate-900/40 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</p>
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:scale-110 transition-transform">{stat.icon}</div>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value.toLocaleString()}</h3>
                  <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase italic">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white dark:bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-[0.1em]">Signal Frequency</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-widest italic">Views vs Clicks over time</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500" /> <span className="text-[9px] font-black uppercase text-slate-500">Views</span></div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500" /> <span className="text-[9px] font-black uppercase text-slate-500">Clicks</span></div>
                  </div>
                </div>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timeline}>
                      <defs>
                        <linearGradient id="gradientViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b0a" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', color: '#fff' }}
                        itemStyle={{ fontWeight: 'black', textTransform: 'uppercase', fontSize: '9px' }}
                      />
                      <Area type="monotone" dataKey="views" stroke="#6366f1" fill="url(#gradientViews)" strokeWidth={4} />
                      <Area type="monotone" dataKey="clicks" stroke="#f43f5e" fill="transparent" strokeWidth={3} strokeDasharray="6 6" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Mini Geo Summary */}
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                <Globe className="absolute -right-20 -bottom-20 w-80 h-80 text-indigo-500 opacity-5 group-hover:rotate-12 transition-transform duration-1000" />
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] opacity-60 flex items-center gap-2 underline decoration-indigo-500 underline-offset-4">Top Sector</h3>
                    <Globe2 className="text-indigo-400 w-5 h-5 animate-spin-slow" />
                  </div>
                  {geoCountries[0] ? (
                    <div className="space-y-4">
                      <div className="text-7xl mb-4 drop-shadow-2xl">{flag(geoCountries[0].country_code)}</div>
                      <div>
                        <p className="text-3xl font-black text-white tracking-tighter">{geoCountries[0].country}</p>
                        <p className="text-sm font-bold text-indigo-400 uppercase tracking-widest">{geoCountries[0].clicks} Signal Hits</p>
                      </div>
                      <div className="pt-4 space-y-2 border-t border-white/10">
                        {geoCountries.slice(1, 4).map((c, i) => (
                          <div key={i} className="flex items-center justify-between text-[10px] font-black text-white/50 uppercase">
                            <span>{flag(c.country_code)} {c.country}</span>
                            <span>{Math.round((c.clicks / (totals?.total_events || 1)) * 100)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-40 flex items-center justify-center font-mono text-[10px] text-white/30 italic">Searching satellites...</div>
                  )}
                </div>
              </div>
            </div>

            {/* Activity Feed Table - Professional View */}
            <div className="bg-white dark:bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-[0.1em] flex items-center gap-2">
                  <List size={18} className="text-indigo-600" /> Recent Activity Log
                </h3>
                <button onClick={fetchData} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400">
                  <Activity size={18} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="pb-4 pl-2">Timestamp</th>
                      <th className="pb-4">Event Type</th>
                      <th className="pb-4">Location</th>
                      <th className="pb-4">Network Info</th>
                      <th className="pb-4 text-right pr-2">Signature</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                    {activity.map((ev) => (
                      <tr key={ev.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="py-4 pl-2 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Clock size={12} className="text-slate-300" />
                            <span className="text-[11px] font-bold text-slate-500">{new Date(ev.created_at).toLocaleTimeString()}</span>
                          </div>
                          <span className="text-[9px] text-slate-400 block ml-5">{new Date(ev.created_at).toLocaleDateString()}</span>
                        </td>
                        <td className="py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter
                               ${ev.event_type === 'link_click' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40'}`}>
                            {ev.event_type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            <span>{flag(ev.country_code)}</span>
                            <span>{ev.city || 'Sector Unknown'}</span>
                          </div>
                          <span className="text-[9px] text-slate-500 uppercase font-black block ml-7">{ev.country_code}</span>
                        </td>
                        <td className="py-4">
                          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 max-w-[180px] truncate" title={ev.isp}>
                            {ev.isp}
                          </div>
                          <div className="text-[9px] text-slate-400 italic truncate max-w-[180px]">{ev.org}</div>
                        </td>
                        <td className="py-4 text-right pr-2 whitespace-nowrap">
                          <span className="font-mono text-[9px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md opacity-50 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">
                            SIG-{ev.id.toString(16).padStart(4, '0')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {viewType === 'traffic' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Detail Area Chart */}
              <div className="bg-white dark:bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-sm">
                <h3 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <Activity size={16} className="text-indigo-500" /> High-Density View Distribution
                </h3>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeline}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b0a" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                      <Tooltip cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
                      <Bar dataKey="views" fill="#6366f1" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="clicks" fill="#f43f5e" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Referrers Detail */}
              <div className="bg-white dark:bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-sm">
                <h3 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                  <Compass size={16} className="text-orange-500" /> Referral Vectors Analysis
                </h3>
                <div className="space-y-6">
                  {referrers.map((ref, i) => (
                    <div key={i} className="group p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl hover:bg-slate-100 transition-colors">
                      <div className="flex justify-between items-end mb-3 font-black uppercase">
                        <div>
                          <p className="text-slate-400 text-[9px] tracking-widest mb-1 italic">Source Channel</p>
                          <p className="text-slate-900 dark:text-slate-200 text-sm tracking-tight">{ref.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-indigo-600 text-xl tracking-tighter mb-[-4px]">{ref.value}</p>
                          <p className="text-slate-400 text-[8px] tracking-[0.2em]">Interceptions</p>
                        </div>
                      </div>
                      <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 transition-all duration-1000 shadow-[0_0_8px_rgb(99,102,241,0.5)]" style={{ width: `${(ref.value / Math.max(...referrers.map(r => r.value), 1)) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {viewType === 'info' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Tech Cards */}
              <div className="bg-white dark:bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-sm">
                <h3 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                  <Monitor size={16} className="text-blue-500" /> Environment Signatures
                </h3>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-[10px] font-black uppercase text-center text-slate-400 tracking-[0.3em] mb-6">Browsers</p>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={browsers} innerRadius={50} outerRadius={70} paddingAngle={8} dataKey="value">
                            {browsers.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2 mt-4">
                      {browsers.map((b, i) => (
                        <div key={i} className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} /> {b.name}</div>
                          <span>{b.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-center text-slate-400 tracking-[0.3em] mb-6">Hardware</p>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={devices} innerRadius={50} outerRadius={70} paddingAngle={8} dataKey="value">
                            {devices.map((e, i) => <Cell key={i} fill={COLORS[(i + 3) % COLORS.length]} />)}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2 mt-4">
                      {devices.map((d, i) => (
                        <div key={i} className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[(i + 3) % COLORS.length] }} /> {d.name}</div>
                          <span>{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-Info Section */}
              <div className="space-y-6">
                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl">
                  <h3 className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em] mb-6">Subject Capabilities</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Mobile Optimized', val: Math.round((devices.find(d => d.name === 'Mobile')?.value || 0) / (totals?.total_events || 1) * 100), icon: <Smartphone />, color: 'text-indigo-400' },
                      { label: 'Core Integrity', val: Math.round((browsers.find(b => b.name === 'Chrome')?.value || 0) / (totals?.total_events || 1) * 100), icon: <ShieldCheck />, color: 'text-emerald-400' },
                      { label: 'Signal Strength', val: 98, icon: <Zap />, color: 'text-amber-400' },
                      { label: 'Logic Processor', val: 100, icon: <Cpu />, color: 'text-rose-400' },
                    ].map((sig, i) => (
                      <div key={i} className="p-4 rounded-3xl bg-white/5 border border-white/5">
                        <div className={`${sig.color} mb-3 opacity-60`}>{sig.icon}</div>
                        <p className="text-[9px] font-black text-white uppercase tracking-widest opacity-40 mb-1">{sig.label}</p>
                        <div className="text-2xl font-black text-white">{sig.val}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewType === 'geo' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white dark:bg-slate-900/40 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800/50 shadow-sm relative overflow-hidden">
                <Globe2 className="absolute -left-20 -bottom-20 w-80 h-80 text-indigo-500/5 group-hover:rotate-12 transition-transform duration-1000" />
                <h3 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-[0.2em] mb-10 flex items-center gap-2 relative z-10">
                  <Globe size={18} className="text-indigo-600" /> Geographic Intersection Matrix
                </h3>
                <div className="grid sm:grid-cols-2 gap-12 relative z-10">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Primary Sectors (Nations)</p>
                    <div className="space-y-6">
                      {geoCountries.map((c, i) => (
                        <div key={i} className="flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                            <span className="text-3xl filter saturate-[1.2] drop-shadow-sm group-hover:scale-125 transition-transform">{flag(c.country_code)}</span>
                            <div>
                              <p className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">{c.country}</p>
                              <p className="text-[9px] font-bold text-slate-400 tracking-tighter italic">{c.country_code} / SECTOR-ALPHA</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-indigo-600 font-black text-lg">{c.clicks}</p>
                            <p className="text-[7px] font-black uppercase text-slate-400">Hits</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Urban Coordinates (Cities)</p>
                    <div className="space-y-6">
                      {geoCities.map((c, i) => (
                        <div key={i} className="flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 group-hover:text-indigo-500 group-hover:bg-indigo-50 transition-all">
                              <MapPin size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight truncate max-w-[120px]">{c.city}</p>
                              <p className="text-[9px] font-bold text-slate-400 tracking-tighter italic">{c.country_code} / CITY-SIG</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-emerald-600 font-black text-lg">{c.clicks}</p>
                            <p className="text-[7px] font-black uppercase text-slate-400">Hits</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-600 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-center">
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="relative z-10 text-center text-white">
                  <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.4em] mb-4">Coverage Integrity</p>
                  <div className="text-9xl font-black tracking-tighter mb-4">{geoCountries.length}</div>
                  <p className="text-lg font-bold text-indigo-100 uppercase tracking-[0.1em] mb-12">Active Nations Intersected</p>
                  <div className="flex flex-wrap justify-center gap-4">
                    {geoCountries.slice(0, 8).map((c, i) => (
                      <div key={i} className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-xl transform rotate-3 hover:rotate-0 transition-transform">
                        {flag(c.country_code)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
