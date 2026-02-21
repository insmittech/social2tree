import React, { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import client from '../src/api/client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import {
  Users, MousePointer2, TrendingUp, BarChart2, Globe, MapPin,
  Monitor, Smartphone, Compass, Activity, ShieldCheck, Zap,
  Calendar, Filter, ChevronRight, Search, List, LayoutGrid,
  Clock, Server, Cpu, Globe2, Plus, ArrowUpRight, ArrowDownRight,
  ChevronDown, Check
} from 'lucide-react';
import { usePageSelector } from '../src/hooks/usePageSelector';
import { useAuth } from '../src/context/AuthContext';
import { formatDate } from '../src/utils/dateUtils';
import Pagination from '../components/Pagination';

interface GeoCountry { country: string; country_code: string; clicks: number; }
interface GeoCity { city: string; country: string; country_code: string; clicks: number; }
interface TimelineData { date: string; views: number; clicks: number; }
interface StatItem { name: string; value: number; }
interface ActivityEvent { id: number; event_type: string; country: string; city: string; country_code: string; isp: string; org: string; user_agent: string; created_at: string; }

const flag = (code: string) => {
  if (!code || code.length !== 2) return '🌐';
  return [...code.toUpperCase()].map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)).join('');
};

const parseUA = (ua: string) => {
  if (!ua) return 'Unknown Node';
  const browsers: Record<string, RegExp> = {
    'Chrome': /Chrome\/([0-9.]+)/,
    'Safari': /Version\/([0-9.]+).*Safari/,
    'Firefox': /Firefox\/([0-9.]+)/,
    'Edge': /Edg\/([0-9.]+)/,
    'Opera': /OPR\/([0-9.]+)/
  };
  const os: Record<string, RegExp> = {
    'iOS': /iPhone|iPad|iPod/,
    'Android': /Android/,
    'Windows': /Windows NT/,
    'macOS': /Macintosh/,
    'Linux': /Linux/
  };

  let bName = 'Other Browser';
  for (const [name, reg] of Object.entries(browsers)) {
    if (reg.test(ua)) { bName = name; break; }
  }

  let oName = 'Unknown OS';
  for (const [name, reg] of Object.entries(os)) {
    if (reg.test(ua)) { oName = name; break; }
  }

  return `${bName} / ${oName}`;
};

const CircularProgress = ({ percent, label, value, subValue, color }: { percent: number, label: string, value: string, subValue: string, color: string }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative w-28 h-28 mb-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="56" cy="56" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-800" />
          <circle cx="56" cy="56" r={radius} stroke={color} strokeWidth="8" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black text-slate-900 dark:text-white">{percent}%</span>
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{label}</span>
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-center gap-2 justify-center">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{value}</span>
          <span className="text-slate-300 mx-1">•</span>
          <span className="text-xs font-bold text-slate-400">{subValue}</span>
        </div>
      </div>
    </div>
  );
};

const Analytics: React.FC = () => {
  const { user: profile, refreshProfile } = useAuth();
  const { selectedPageId, setSelectedPageId } = usePageSelector();
  const location = useLocation();
  const currentPath = location.pathname;

  // Filters State
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedLink, setSelectedLink] = useState<string>('all');
  const [showPageSelector, setShowPageSelector] = useState(false);

  // Data State
  const [timeline, setTimeline] = useState<TimelineData[]>([]);
  const [browsers, setBrowsers] = useState<StatItem[]>([]);
  const [devices, setDevices] = useState<StatItem[]>([]);
  const [referrers, setReferrers] = useState<StatItem[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [totals, setTotals] = useState<any>(null);
  const [geoCountries, setGeoCountries] = useState<GeoCountry[]>([]);
  const [geoCities, setGeoCities] = useState<GeoCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
        client.get('/analytics/advanced_stats.php', { params }).catch(e => ({ data: { timeline: [], browsers: [], devices: [], referrers: [], activity: [], totals: null, sources: [] } }))
      ]);

      setGeoCountries(geoRes.data.countries || []);
      setGeoCities(geoRes.data.cities || []);
      setTimeline((advancedRes.data.timeline || []).map((t: TimelineData) => ({ ...t, date: t.date.toUpperCase() })));
      setBrowsers(advancedRes.data.browsers || []);
      setDevices(advancedRes.data.devices || []);
      setReferrers(advancedRes.data.referrers || []);
      setSources(advancedRes.data.sources || []);
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

  const totalPages = Math.ceil(activity.length / itemsPerPage);
  const paginatedActivity = activity.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const viewType = useMemo(() => {
    if (currentPath.endsWith('/traffic')) return 'traffic';
    if (currentPath.endsWith('/info')) return 'info';
    if (currentPath.endsWith('/geo')) return 'geo';
    return 'overview';
  }, [currentPath]);

  // Derived Sparkline Data from real timeline
  const viewsSpark = useMemo(() => timeline.map(t => ({ v: t.views })), [timeline]);
  const clicksSpark = useMemo(() => timeline.map(t => ({ v: t.clicks })), [timeline]);

  if (!profile || !activePage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#05080f] pb-32 sm:pb-24 font-sans selection:bg-indigo-500/30 overflow-x-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 py-6 sm:py-10 space-y-8">

        {/* Navigation & Header - Reference Matched + Dropdown in Right Corner */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#10b981] font-black text-[10px] uppercase tracking-[0.2em]">
              <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              Live Monitoring
            </div>
            <h1 className="text-3xl sm:text-[40px] font-black text-[#0f172a] dark:text-white tracking-tight leading-none">
              Analytics Overview
            </h1>
            <p className="text-sm font-bold text-slate-400">
              Showing real-time interaction for <span className="text-indigo-600">@{activePage.slug}</span>
            </p>
          </div>

          <div className="flex items-center gap-4 self-end lg:self-center">
            {/* Page Selector Dropdown in Right Corner */}
            <div className="relative">
              <button
                onClick={() => setShowPageSelector(!showPageSelector)}
                className="flex items-center gap-2 p-1.5 pr-4 bg-white dark:bg-[#0b121e] rounded-full border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-indigo-600 dark:bg-teal-500 flex items-center justify-center text-[10px] font-black uppercase text-white dark:text-slate-950 shadow-sm">
                    {activePage.slug.substring(0, 2).toUpperCase()}
                  </div>
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 ml-1">@{activePage.slug}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${showPageSelector ? 'rotate-180' : ''}`} />
              </button>

              {showPageSelector && (
                <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-[#0b121e] rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-slate-50 dark:border-slate-800/30">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Switch Workspace</span>
                  </div>
                  <div className="p-2 max-h-[300px] overflow-y-auto no-scrollbar">
                    {profile.pages?.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedPageId(p.id);
                          setShowPageSelector(false);
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${p.id === selectedPageId ? 'bg-indigo-50 dark:bg-teal-500/10 text-indigo-600 dark:text-teal-400' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300'}`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black uppercase ${p.id === selectedPageId ? 'bg-indigo-600 dark:bg-teal-500 text-white dark:text-slate-950' : 'bg-slate-100 dark:bg-slate-800'}`}>
                          {p.slug.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-xs font-black">{p.displayName}</p>
                          <p className="text-[9px] text-slate-400">@{p.slug}</p>
                        </div>
                        {p.id === selectedPageId && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                  <div className="p-2 border-t border-slate-50 dark:border-slate-800/30">
                    <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#0f172a] dark:bg-teal-500 text-white dark:text-slate-950 text-[11px] font-black uppercase tracking-widest hover:opacity-90">
                      <Plus size={14} /> New Tree
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filters Panel - Reference Matched (Capsule Row) */}
        <div className="bg-white dark:bg-[#0b121e] p-4 rounded-[1.5rem] border border-slate-100 dark:border-slate-800/50 shadow-sm flex flex-col lg:flex-row items-center gap-4 transition-colors">
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#05080f] px-5 py-3 rounded-2xl flex-1 w-full lg:w-auto border border-slate-100 dark:border-slate-800 transition-all focus-within:ring-2 focus-within:ring-indigo-500/20">
            <Filter size={20} className="text-slate-400" />
            <select
              value={selectedLink}
              onChange={(e) => setSelectedLink(e.target.value)}
              className="bg-transparent text-[11px] font-black text-slate-600 dark:text-slate-300 outline-none w-full uppercase tracking-[0.1em] cursor-pointer"
            >
              <option value="all">All Signals (Page Views + All Links)</option>
              {activePage.links.map(l => (
                <option key={l.id} value={l.id}>{l.title || 'Untitled Node'}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 px-5 py-3 rounded-2xl w-full sm:w-auto border border-slate-100 dark:border-slate-800">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">From</span>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="bg-transparent text-xs font-black text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#05080f] px-5 py-3 rounded-2xl w-full sm:w-auto border border-slate-100 dark:border-slate-800">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">To</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="bg-transparent text-xs font-black text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
              />
            </div>
            <button onClick={fetchData} className="bg-indigo-600 dark:bg-teal-500 p-3.5 rounded-2xl text-white dark:text-slate-950 hover:bg-indigo-700 dark:hover:bg-teal-400 transition-all shadow-lg shadow-indigo-100 dark:shadow-none active:scale-95 flex items-center justify-center w-full sm:w-auto">
              <Search size={22} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* --- DYNAMIC VIEWS --- */}

        {viewType === 'overview' && (
          <div className="space-y-10 animate-in fade-in duration-700">
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'Total Intersections', value: totals?.total_events || 0, icon: <Zap className="text-amber-500" />, sub: 'Signals', trend: '+12.5%', color: 'from-amber-50 to-white' },
                { label: 'Unique Subjects', value: totals?.unique_visitors || 0, icon: <Users className="text-indigo-500" />, sub: 'Distinct IPs', trend: '+6.2%', color: 'from-indigo-50 to-white' },
                { label: 'Node Interactions', value: totals?.node_interactions || 0, icon: <MousePointer2 className="text-rose-500" />, sub: 'Total Clicks', trend: '-2.4%', color: 'from-rose-50 to-white', down: (totals?.node_interactions < 10) },
                { label: 'Urban Coverage', value: totals?.total_cities || 0, icon: <MapPin className="text-emerald-500" />, sub: 'Cities Identified', trend: '+18.7%', color: 'from-emerald-50 to-white' },
              ].map((stat, i) => (
                <div key={i} className={`bg-gradient-to-br ${stat.color} dark:from-slate-900/50 dark:to-slate-900/20 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500`}>
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">{stat.icon}</div>
                    <div className={`flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full ${stat.down ? 'text-rose-600 bg-rose-50' : 'text-emerald-600 bg-emerald-50'} dark:bg-slate-800`}>
                      {stat.down ? <ArrowDownRight size={12} strokeWidth={3} /> : <ArrowUpRight size={12} strokeWidth={3} />}
                      {stat.trend}
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{stat.label}</p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-[34px] font-black text-slate-900 dark:text-white tracking-tighter tabular-nums leading-none">
                        {stat.value.toLocaleString()}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-300 uppercase italic font-serif opacity-0 group-hover:opacity-100 transition-opacity">{stat.sub}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sparkline Stats Grid - Ref Matched */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'Avg Session', value: totals?.avg_session_display || '0m 00s', color: '#10b981', trend: viewsSpark },
                { label: 'Conversion', value: `${totals?.conversion_rate || 0}%`, color: '#3b82f6', trend: clicksSpark },
                { label: 'Bounce Rate', value: `${totals?.bounce_rate || 0}%`, color: '#f43f5e', trend: viewsSpark },
                { label: 'Active Nodes', value: totals?.active_nodes || 0, color: '#8b5cf6', trend: clicksSpark },
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-slate-900/40 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 shadow-sm flex items-center justify-between overflow-hidden group hover:border-indigo-100 transition-colors">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1.5">{stat.label}</p>
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums leading-none">{stat.value}</h4>
                  </div>
                  <div className="w-24 h-12 -mr-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stat.trend.length > 0 ? stat.trend : [{ v: 0 }, { v: 0 }]}>
                        <defs>
                          <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={stat.color} stopOpacity={0.2} />
                            <stop offset="100%" stopColor={stat.color} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke={stat.color} fill={`url(#grad-${i})`} strokeWidth={3} dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity Log - Full Screen Responsive Layout */}
            <div className="bg-white dark:bg-[#0b121e] rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-sm overflow-hidden transition-colors">
              <div className="p-8 sm:p-10 pb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-50 dark:bg-slate-800 p-3 rounded-2xl text-indigo-600 shadow-sm"><Clock size={20} /></div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base uppercase tracking-[0.1em]">Recent Activity Log</h3>
                </div>
                <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1.5 px-4 py-2 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-95">
                  View All <ChevronRight size={16} />
                </button>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-50 dark:border-slate-800 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <th className="py-8 pl-10">Timestamp</th>
                      <th className="py-8">Event Type</th>
                      <th className="py-8">Location</th>
                      <th className="py-8">Network Info</th>
                      <th className="py-8">Signature</th>
                      <th className="py-8 text-center pr-10">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40">
                    {activity.length === 0 ? (
                      <tr><td colSpan={6} className="py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">No signals detected in this period</td></tr>
                    ) : paginatedActivity.map((ev) => (
                      <tr key={ev.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all cursor-default">
                        <td className="py-8 pl-10 text-xs font-black text-slate-800 dark:text-slate-200 tabular-nums">
                          {formatDate(ev.created_at, profile?.timezone, profile?.timeFormat)}
                        </td>
                        <td className="py-8">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] shadow-sm ${ev.event_type === 'link_click' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'}`}>
                            {ev.event_type === 'link_click' ? 'Click Event' : 'Page View'}
                          </span>
                        </td>
                        <td className="py-8">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{flag(ev.country_code)}</span>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{ev.city || 'Unknown'}, {ev.country_code}</span>
                          </div>
                        </td>
                        <td className="py-8 text-xs font-bold text-slate-400 tracking-tight font-mono opacity-80">{ev.isp?.substring(0, 20)}...</td>
                        <td className="py-8 text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-tighter">{parseUA(ev.user_agent)}</td>
                        <td className="py-8 pr-10 text-center">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 mx-auto animate-pulse shadow-[0_0_10px_rgb(16,185,129,0.5)]" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>

            {/* Audience Behavior Breakdown - Ref Matched SVG Circles */}
            <div className="bg-white dark:bg-[#0b121e] p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800/50 shadow-sm relative overflow-hidden transition-colors">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 dark:bg-indigo-900/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-10" />
              <div className="flex items-center gap-4 mb-14">
                <div className="bg-blue-50 dark:bg-slate-800 p-3 rounded-2xl text-blue-600"><Compass size={22} /></div>
                <h3 className="font-black text-slate-900 dark:text-white text-base uppercase tracking-[0.12em]">Audience Behavior Breakdown</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-20">
                <CircularProgress percent={devices.find(d => d.name === 'Mobile')?.value ? Math.round((devices.find(d => d.name === 'Mobile')!.value / devices.reduce((acc, d) => acc + d.value, 0)) * 100) : 0} label="Device" value={devices.find(d => d.name === 'Mobile')?.value.toString() || '0'} subValue="Mobile" color="#3b82f6" />
                <CircularProgress percent={sources[0]?.percent || 0} label="Source" value={sources[0]?.value.toString() || '0'} subValue={sources[0]?.name || 'Direct'} color="#10b981" />
                <CircularProgress percent={totals?.user_loyalty || 0} label="User Loyalty" value={Math.round((totals?.user_loyalty / 100) * totals?.unique_visitors || 0).toString()} subValue="Returning" color="#f59e0b" />
              </div>
            </div>

            {/* Charts Section - Bottom Row */}
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Signal Frequency - Grouped Bar Aesthetics */}
              <div className="lg:col-span-2 bg-white dark:bg-[#0b121e] p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800/50 shadow-sm transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-base uppercase tracking-[0.1em]">Signal Frequency</h3>
                    <p className="text-[11px] font-bold text-slate-300 uppercase mt-1 tracking-widest italic opacity-80">Views vs Clicks over time</p>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2.5 font-black text-[10px] uppercase text-slate-500 tracking-widest">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm" /> Views
                    </div>
                    <div className="flex items-center gap-2.5 font-black text-[10px] uppercase text-slate-500 tracking-widest">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#f472b6] shadow-sm" /> Clicks
                    </div>
                  </div>
                </div>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeline} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: '900' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: '900' }} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px' }} />
                      <Bar dataKey="views" fill="#3b82f6" radius={[12, 12, 12, 12]} barSize={24} />
                      <Bar dataKey="clicks" fill="#f472b6" radius={[12, 12, 12, 12]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Sector Detail - Dark Premium Card Ref Matched */}
              <div className="bg-[#0f172a] p-10 sm:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group border border-white/5">
                {/* Subtle Background Globe Influence */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1e293b] to-[#0f172a] -z-10" />
                <div className="absolute top-0 right-0 w-full h-full p-4 overflow-hidden pointer-events-none opacity-20">
                  <Globe2 className="w-[120%] h-[120%] -mr-[30%] -mt-[30%] text-white animate-spin-slow" />
                </div>

                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-16">
                    <span className="text-[11px] font-black text-white/30 uppercase tracking-[0.5em]">Global Pulse</span>
                    <div className="p-3 bg-white/5 rounded-2xl text-white/40 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-all duration-500">
                      <Globe size={20} />
                    </div>
                  </div>

                  <div className="mb-20">
                    <h3 className="text-6xl font-black text-white tracking-tighter mb-4">{geoCountries[0]?.country || 'India'}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-[34px] font-black text-blue-500 leading-none">{geoCountries[0]?.clicks?.toLocaleString() || '1,842'}</span>
                      <span className="uppercase text-[11px] font-black text-white/30 tracking-[0.2em] mt-1">Interceptions</span>
                    </div>
                  </div>

                  <div className="space-y-10 pt-12 border-t border-white/10">
                    {(geoCities.length > 0 ? geoCities : [
                      { city: 'Mumbai', clicks: 842, percent: 75 },
                      { city: 'Delhi', clicks: 423, percent: 45 },
                    ]).slice(0, 2).map((item, i) => (
                      <div key={i} className="space-y-4">
                        <div className="flex justify-between items-end">
                          <span className="text-[11px] font-black uppercase text-white/40 tracking-[0.2em]">{item.city}</span>
                          <span className="text-base font-black text-white/80 tabular-nums">{item.clicks?.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgb(59,130,246,0.6)]"
                            style={{ width: `${(item.clicks / (geoCountries[0]?.clicks || item.clicks)) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TRAFFIC HUB VIEW (Optimized) --- */}
        {viewType === 'traffic' && (
          <div className="animate-in slide-in-from-bottom-6 duration-700 space-y-10">
            <div className="bg-white dark:bg-slate-900/40 p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800/50 shadow-sm text-center">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 w-24 h-24 rounded-[2.5rem] flex items-center justify-center text-indigo-600 mx-auto mb-8 shadow-inner">
                <Compass size={48} strokeWidth={2.5} className="animate-pulse" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">Traffic Channel Hub</h2>
              <p className="max-w-xl mx-auto text-slate-500 dark:text-slate-400 font-bold text-sm leading-relaxed mb-10">
                Comprehensive breakdown of signal entry origins, referral headers, and path redirection vectors across your entire node ecosystem.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {sources.length === 0 ? (
                  <div className="col-span-4 p-12 text-center text-slate-400 font-black uppercase text-[10px] tracking-widest bg-slate-50 dark:bg-slate-800/20 rounded-[2rem]">
                    No entry vectors identified yet
                  </div>
                ) : sources.slice(0, 4).map((c, i) => (
                  <div key={i} className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{c.name}</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white leading-none mb-1">{c.value.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-indigo-500 uppercase">{c.percent}% Signal Share</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
